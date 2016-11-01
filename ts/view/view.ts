"use strict";

namespace View 
{
    export function init()
    {
        View.Canvas.init();
        document.getElementById("popup").addEventListener('click', Popup.hideCurrent);
    }

    export function getCanvas(): HTMLCanvasElement
    {
        return <HTMLCanvasElement>document.getElementById("canvas_ludus");
    }

    export function showInfo(title: string, description: string)
    {
        let popup = new Popup();
        popup.div.innerHTML = '<h2 style="margin:10px">' + title + '</h2>' + '<p>' + description + '</p>';
        popup.show();
    }

    export function setHUDText(text: string)
    {
        document.getElementById('hud_span').innerText = text;
    }
}