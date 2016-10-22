"use strict";

namespace View 
{
    export function init()
    {
        View.Canvas.init()
    }

    export function getCanvas(): HTMLCanvasElement
    {
        return <HTMLCanvasElement>document.getElementById("canvas_ludus");
    }

    export function showPopup(title: string)
    {
        var template = '\
        <div class="{{classes}}" onclick="Controller.Popup.onItemClicked({{index}}); event.stopPropagation();">\
            <h3>{{title}}</h3>\
            <div style="position: relative">\
            <img style="opacity: {{opacity}}" height="180px" src="{{image}}">\
            <img class="centre" {{lock_hidden}} src="images/lock.png">\
            </div>\
            <p>{{description}}</p>\
        </div>'

        let items = Controller.Popup.items;
        var html = ''

        if (title)
            html += '<h2 style="margin:10px">' + title + '</h2>';

        for (var i = 0; i < items.length; ++i)
        {
            var itemHtml = template;
            itemHtml = itemHtml.replace('{{index}}', String(i));
            itemHtml = itemHtml.replace('{{title}}', items[i].title);
            itemHtml = itemHtml.replace('{{image}}', items[i].image);
            itemHtml = itemHtml.replace('{{description}}', items[i].description);
            itemHtml = itemHtml.replace('{{classes}}', items[i].locked ? 'item disabled' : 'item');
            itemHtml = itemHtml.replace('{{opacity}}', items[i].locked ? '0.5' : '1');
            itemHtml = itemHtml.replace('{{lock_hidden}}', items[i].locked ? '' : 'hidden');

            html += itemHtml;
            if (i > 0 && i % 4 == 0)
                html += '<br>';
        }

        document.getElementById('container').innerHTML = html;
        document.getElementById('container').className = 'show';
        document.getElementById('popup').className = 'show';
    }

    export function hidePopup()
    {
        document.getElementById('container').className = '';
        document.getElementById('popup').className = '';
    }

    export function showInfo(title: string, description: string)
    {
        var template = '\
        <div class="item">\
            <p>{{description}}</p>\
        </div>'

        var html = '<h2 style="margin:10px">' + title + '</h2>';

        var itemHtml = template;
        itemHtml = itemHtml.replace('{{description}}', description);
        html += itemHtml;

        document.getElementById('container').innerHTML = html;
        document.getElementById('container').className = 'show';
        document.getElementById('popup').className = 'show';
    }

    export function setHUDText(text: string)
    {
        document.getElementById('hud_span').innerText = text;
    }
}