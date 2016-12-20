"use strict";

const $ = require ('jquery');
const _ = require ('lodash');
const Backbone = require ('backbone');
const joint = require ('jointjs');
const {g, V} = joint;

const Model = require ('./model');
const {topological_sort, can_reach, propagate} = require ('./graph');

const models = {
    Button: require ('./models/button.js'),
    Counter: require ('./models/counter.js'),
    Mover: require ('./models/mover.js')
};

class Frandre {
    constructor () {
        const container = $('<div>');
        container.appendTo (document.body);

        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper ({
            el: container,
            gridSize: 10,
            model: this.graph,
            width: $(document.body).width (),
            height: $(document.body).height (),

            defaultLink: Frandre.createLink,
            validateConnection: this.validateConnection.bind(this),
            snapLinks: true,
            linkPinning: false,
            markAvailable: true,
            options: _.defaults({
                doubleLinkTools: true,
                longLinkLength: 400
            }, joint.dia.LinkView.prototype.options)
        });

        // Thanks to https://github.com/nomeata/incredible/blob/7273d45cb7a7cf13ef72440262e6be604eae7d86/webui/graph-interaction.js#L80
        this.paper.on('blank:pointerdown', (e, x, y) => {
            if (e.shiftKey) { return; }

            var pos0 = {x: e.pageX, y: e.pageY};

            document.onmousemove = (e) => {
                var pos1 = {x: e.pageX, y: e.pageY};
                this.paper.setOrigin(
                    this.paper.options.origin.x + pos1.x - pos0.x,
                    this.paper.options.origin.y + pos1.y - pos0.y
                );
                pos0 = pos1;
            };

            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            e.stopPropagation();
        });

        this.currentEvents = [];
        this.handlingEvents = false;
    }

    static createLink (cellView, magnet) {
        return new joint.shapes.devs.Link ({
            arrowheadMarkup: [
                '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
                    '<circle class="marker-arrowhead" end="<%= end %>" r="10"/>',
                '</g>'
            ].join (''),

            attrs: {
                '.connection': { 'stroke-width': 2 },
            },

            router: { name: 'metro' },
            connector: { name: 'jumpover' }
        });
    }

    validateConnection (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        //console.log (magnetS, magnetT);
        if (! magnetS
            || ! magnetT
            || magnetS.getAttribute ('port-group')
                == magnetT.getAttribute ('port-group')) {
            return false;
        } else {
            const out_links = this.graph.getConnectedLinks (
                cellViewS.model, { outbound: true });
            if (_.any (out_links, (link) =>
                    link.findView (this.paper) !== linkView
                    && link.get ('source').port == magnetS.getAttribute ('port')
                    && link.get ('target').id == cellViewT.model.id
                    && link.get ('target').port == magnetT.getAttribute ('port')
                )) return false;

            return ! _.any (
                cellViewT.model.getStrongDeps (magnetT.getAttribute ('port')),
                (p) => can_reach (
                    this,
                    cellViewT.model.id,
                    p,
                    cellViewS.model.id,
                    magnetS.getAttribute ('port')
                )
            );
        }
    }

    updateSize () {
        this.paper.setDimensions (
            $(document.body).width (),
            $(document.body).height ()
        );
    }

    play () {
        window._x1 = new models.Button (this);
        window._x2 = new models.Button (this);

        window._y = new models.Counter (this);
        window._mv = new models.Mover (this);
    }

    processEvents () {
        this.handlingEvents = true;
        for (let limit = 0; limit < 500 && this.currentEvents.length; limit ++) {
            const [node_id, port, val] = this.currentEvents.shift ();
            propagate (this, node_id, port, val);
        }
        if (this.currentEvents.length) {
            console.warn ('Too many events, processing more later');
            setTimeout (this.processEvents.bind (this), 0);
        } else {
            this.handlingEvents = false;
        }
    }
}

let fr;

$(() => {
    fr = new Frandre;
    fr.play ();
    window.onresize = () => {
        fr.updateSize ();
    };
});
