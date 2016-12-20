"use strict";

class CycleFoundError extends Error {}

module.exports = {
    topological_sort (frandre, from_node, from_port) {
        const marks = {};
        const list = [];

        function hash (node_id, port) {
            return node_id + '/' + port;
        }

        function worker (node_id, port) {
            //console.log (node_id, port);
            const h = hash (node_id, port);
            if (! marks.hasOwnProperty (h)) {
                marks[h] = 0;
                const this_node = frandre.paper.getModelById (node_id);
                for (let link of frandre.graph.getConnectedLinks (
                    this_node, { outbound: true })
                )
                    if (link.get('source').port == port) {
                        const { id: that_id, port: that_in_port } = link.get ('target');
                        if (that_id) {
                            const that_node = frandre.paper.getModelById (that_id);
                            for (let out_port of that_node.getStrongDeps(that_in_port))
                                worker (that_id, out_port);
                        }
                    }
                marks[h] = 1;
                list.unshift ([node_id, port]);
            } else if (marks[h] == 0) {
                throw new CycleFoundError();
            }
        }

        worker (from_node, from_port);

        return list;
    },

    can_reach (frandre, from_id, from_port, to_id, to_port) {
        const marks = {};

        function hash (node_id, port) {
            return node_id + '/' + port;
        }

        function worker (node_id, port) {
            const h = hash (node_id, port);
            if (node_id === to_id && port == to_port)
                return true;
            else if (! marks.hasOwnProperty (h)) {
                marks[h] = 0;
                const this_node = frandre.paper.getModelById (node_id);
                for (let link of frandre.graph.getConnectedLinks (
                    this_node, { outbound: true })
                )
                    if (link.get('source').port == port) {
                        const { id: that_id, port: that_in_port } = link.get ('target');
                        if (that_id) {
                            const that_node = frandre.paper.getModelById (that_id);
                            for (let out_port of that_node.getStrongDeps(that_in_port))
                                if (worker (that_id, out_port)) return true;
                        }
                    }
                return false;
            }
        }

        return worker (from_id, from_port);
    },

    propagate (frandre, from_id, from_port, event_value) {
        const list = topological_sort (frandre, from_id, from_port);
        // { node_id: { output_port: [events] } }
        const mark = { [from_id]: { [from_port]: [event_value] } };
        const seen = [];

        function worker ([node_id, port]) {
            //console.log (node_id, port);
            const this_node = frandre.paper.getModelById (node_id);
            if (! mark.hasOwnProperty (node_id)) {
                const r = this_node.bumpEvents ();
                mark[node_id] = r;
            }
            for (let link of frandre.graph.getConnectedLinks (
                this_node, { outbound: true })
            ) {
                const p = link.get ('source').port;
                if (mark[node_id].hasOwnProperty (p)) {
                    const { id: that_id, port: that_in_port } = link.get ('target');
                    if (that_id) {
                        seen.push (that_id);
                        const that_node = frandre.paper.getModelById (that_id);
                        for (let ev of mark[node_id][p])
                            that_node.addEvent (that_in_port, ev);
                    }
                }
            }
        }

        for (let x of list) worker (x);
        for (let x of seen)
            if (! mark.hasOwnProperty (x)) {
                const r = frandre.paper.getModelById (x).bumpEvents ();
                mark[x] = r;
            }
    }
};
