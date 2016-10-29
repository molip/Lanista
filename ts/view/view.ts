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
        <tr class="{{classes}}" style="opacity: {{opacity}}; " onclick="Controller.Popup.onItemClicked({{index}}); event.stopPropagation();">\
            <td style="width:20%">\
                <h4>{{title}}</h4>\
            </td>\
            <td style="position: relative; width:20%">\
                <img class="centre" style="height:90%" src="{{image}}">\
                <!--<img class="centre" style="height:50%" {{lock_hidden}} src="images/lock.png">-->\
            </td>\
            <td>\
                <p>{{description}}</p>\
            </td>\
        </tr>'

        let items = Controller.Popup.items;
        var html = ''

        if (title)
            html += '<h3 style="margin:1vmin; text-align: center">' + title + '</h3>';

        html += '<div class="container_scroller"> <table>';

        for (var i = 0; i < items.length; ++i)
        {
            var itemHtml = template;
            itemHtml = itemHtml.replace('{{index}}', String(i));
            itemHtml = itemHtml.replace('{{title}}', items[i].title);
            itemHtml = itemHtml.replace('{{image}}', items[i].image);
            itemHtml = itemHtml.replace('{{description}}', items[i].description);
            itemHtml = itemHtml.replace('{{classes}}', items[i].locked ? 'disabled' : '');
            itemHtml = itemHtml.replace('{{opacity}}', items[i].locked ? '0.5' : '1');
            itemHtml = itemHtml.replace('{{lock_hidden}}', items[i].locked ? '' : 'hidden');

            html += itemHtml;
        }

        html += '</table></div>';

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