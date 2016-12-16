const $ = require ('jquery');
const _ = require ('lodash');
const Backbone = require ('backbone');
const joint = require ('jointjs');
const {g, V} = joint;

const frandreLink = new joint.dia.Link ({
    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<circle class="marker-arrowhead" end="<%= end %>" r="10"/>',
        '</g>'
    ].join (''),

    attrs: {
        '.connection': { 'stroke-width': 4 },
    },

    router: { name: 'metro' },
    connector: { name: 'rounded' }
});

class Frandre {
    constructor () {
        const container = $('<div>');
        container.appendTo (document.body);

        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper ({
            el: container,
            gridSize: 1,
            model: this.graph,
            width: $(document.body).width (),
            height: $(document.body).height (),

            defaultLink: frandreLink
        });
    }

    updateSize () {
        this.paper.setDimensions (
            $(document.body).width (),
            $(document.body).height ()
        );
    }
    
    play () {
        const m = new joint.shapes.devs.Model({
            position: { x: 50, y: 50 },
            size: { width: 90, height: 90 },
            inPorts: ['in1','in2'],
            outPorts: ['out'],
            ports: {
            portMarkup: '',
                groups: {
                    'in': {
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                            }
                        }
                    },
                    'out': {
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                }
            },
            attrs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        });
        this.graph.addCells([m]);

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
