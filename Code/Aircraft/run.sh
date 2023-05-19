#!/usr/bin/env bash

function stage_one() {
    mkdir -p WebGL/Aircraft
    cd WebGL/Aircraft

    wget "http://philcrowther.com/WebGL/Aircraft/FM2_cloud.html"

    mkdir fx mod139 sky styles models

    cd styles
    wget "http://philcrowther.com/WebGL/Aircraft/styles/butn_fm2.css"

    cd ../fx
    wget "http://philcrowther.com/WebGL/Aircraft/fx/prop.jpg"

    cd ../models
    mkdir fm2
    cd fm2
    wget "http://philcrowther.com/WebGL/Aircraft/models/fm2/fm2_flyt_caf_npa.glb"
    # http://philcrowther.com/WebGL/Aircraft/models/fm2/fm2_flyt_vcp_npa.glb
    # http://philcrowther.com/WebGL/Aircraft/models/fm2/fx/fm2.wav
    # http://philcrowther.com/WebGL/Aircraft/models/fm2/fx/fm2_prop.wav

    cd ../../sky
    mkdir -p box/cloudy2
    cd box/cloudy2
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/nx.jpg"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/ny.jpg"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/nz.jpg"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/px.jpg"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/py.jpg"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/box/cloudy2/pz.jpg"

    cd ../../
    mkdir fx
    cd fx
    wget "http://philcrowther.com/WebGL/Aircraft/sky/fx/hexangle.png"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/fx/lensflare1.png"
    wget "http://philcrowther.com/WebGL/Aircraft/sky/fx/undercast.png"

    cd ../../mod139
    mkdir build
    mkdir -p examples/jsm

    cd build
    wget "http://philcrowther.com/WebGL/Aircraft/mod139/build/three.module.js"

    cd ../examples/jsm
    mkdir libs loaders objects

    cd libs
    wget "http://philcrowther.com/WebGL/Aircraft/mod139/examples/jsm/libs/stats.module.js"

    cd ../loaders
    wget "http://philcrowther.com/WebGL/Aircraft/mod139/examples/jsm/loaders/GLTFLoader.js"

    cd ../objects
    wget "http://philcrowther.com/WebGL/Aircraft/mod139/examples/jsm/objects/Lensflare.js"
}
