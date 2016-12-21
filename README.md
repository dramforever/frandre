# Frandre

This project is **entirely work-in-progress** and basically nothing is available yet.

## Early demo

![Frandre early demo](http://i.imgur.com/29vK8Zk.gif)

![Frandre early demo](http://i.imgur.com/CfbNZkH.gif)

## What?

'Frandre' stands for *F*unctional *R*eactive *An*imation *Dr*awing *E*nvironment.

It is a project inspired by Fran, Functional Reactive Animation, the now defunct but elegant combinator library. It allows users to define animations (or other interactive programs) in a functional reactive programming (FRP) style. (Straightforward name, isn't it?)

Frandre is (to be) a *graphical* environment for creating such programs. The user would draw a *circuit* of reactive components, and Frandre would interpret it.

Now a basic circuit editor and interpreter is ready (see demo above), but it has lots of problems, and there aren't enough components to be useful. But it's already reacting! Isn't it cute?

*Etymology note*: There's a cute (!) vampire in the game series *Touhou Project*. Her name is *Flandre Scarlet* and she's nicknamed *Flan*.

## Usage

### Basic Usage

When you start Frandre, you will see a bunch of blocks lying around. (This will change, I promise!)

Click and drag on empty space to pan.

Click on an output port (square port pointing out) and drag to an input port to create a link. 

As for what linking those stuff means, well, it's a bit hard to explain, so let's hope I figure it out soon.

Error checking is sparse. Use the console (Ctrl-Shift-I). Reload when things stop responding (Tip: You can use F5 in Developer Tools).

Some blocks:

- `click`: A button
- `gate`: Click to toggle enable/disable. When enabled it's blue. Passes signal through only if enabled.
- `mouse`: Current mouse position `[x, y]`
- Unlabeled except port `in`: Display. Shows the value of last event. (Tru `mouse ->- display`)

And some circuits to try:

- `mouse ->- gate ->- float`
- `δt ->- display` and `t ->- display`

Try this:

                          _______________
    click |>--------------|> up         |
                          |             |
    click |>--------------|> down       |
                          '-------------'

Try this counter:

                       _________________
    click |>-----------|> s            |
                       |       +   out |]-----+---------|> display
               +-------|> w            |      |
               |       '---------------'      |
               |                              |
               +------------------------------+


### Starting it

Now that we covered basic usage of Frandre, let's actually start Frandre so there's something to use.

You need `node` and `npm`. I use the following versions:

    node: v6.4.0
    npm: 3.10.3

I hope any recent version work.

Get the dependencies:

    git clone https://github.com/dramforever/frandre.git
    cd frandre
    npm install

Run it:

    npm start

## Thanks

- Thanks to [jointjs](http://jointjs.com) for the excellent diagramming library.
- And Thanks to [electron](http://electron.atom.io) for making it possible to use web libraries in native apps.
- Thanks to [Incredible proof machine](http://incredible.pm) for some code. (Search `incredible` in the code to see it.)
