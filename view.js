
var View = {}


View.showPopup = function(popup, title)
{
    var template = '\
	    <div id="{{id}}" class="{{classes}}" onclick="Popup.onItemClicked({{index}}); event.stopPropagation();">\
		    <h3>{{title}}</h3>\
		    <div style="position: relative">\
            <img style="opacity: {{opacity}}" height="200px" src="{{image}}">\
            <img class="centre" {{lock_hidden}} src="images/lock.png">\
            </div>\
		    <p>{{description}}</p>\
	    </div>'

    var html = ''

    if (title)
        html += '<h2 style="margin:10px">' + title + '</h2>';

    for (var i = 0; i < popup.items.length ; ++i)
    {
        var title = popup.items[i].title;
        if (popup.items[i].title2)
            title += '<br>' + popup.items[i].title2;

        var itemHtml = template;
        itemHtml = itemHtml.replace('{{index}}', i);
        itemHtml = itemHtml.replace('{{title}}', title);
        itemHtml = itemHtml.replace('{{image}}', popup.items[i].image);
        itemHtml = itemHtml.replace('{{description}}', popup.items[i].description);
        itemHtml = itemHtml.replace('{{classes}}', popup.items[i].locked ? 'item disabled' : 'item');
        itemHtml = itemHtml.replace('{{opacity}}', popup.items[i].locked ? '0.5' : '1');
        itemHtml = itemHtml.replace('{{lock_hidden}}', popup.items[i].locked ? '' : 'hidden');
        
        html += itemHtml;
    }

    document.getElementById('container').innerHTML = html;
    document.getElementById('container').className = 'show';
    document.getElementById('popup').className = 'show';
}

View.hidePopup = function ()
{
    document.getElementById('container').className = '';
    document.getElementById('popup').className = '';
}

View.showInfo = function (title, description) {
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
