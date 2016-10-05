
var View = {}


View.showPopup = function(popup, title)
{
    var template = '\
	    <div id="{{id}}" class="item" onclick="Popup.onItemClicked({{index}}); event.stopPropagation();">\
		    <h3>{{title}}</h3>\
		    <img height="200px" src="{{image}}">\
		    <p>{{description}}</p>\
	    </div>'

    var html = ''

    if (title)
        html += '<h2 style="margin:10px">' + title + '</h2>';

    for (var i = 0; i < popup.items.length ; ++i)
    {
        var itemHtml = template;
        itemHtml = itemHtml.replace('{{index}}', i);
        itemHtml = itemHtml.replace('{{title}}', popup.items[i].title);
        itemHtml = itemHtml.replace('{{image}}', popup.items[i].image);
        itemHtml = itemHtml.replace('{{description}}', popup.items[i].description);
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
