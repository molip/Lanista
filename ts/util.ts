var Util = {}

Util.formatMoney = function (amount)
{
    return '§' + amount;
}

Util.getEventPos = function (event, element)
{
    var rect = element.getBoundingClientRect();
    return new Point(event.clientX - rect.left, event.clientY - rect.top);
}

Util.assert = function (condition, message)
{
    if (!condition)
        alert(message ? 'Assertion failed: ' + message : 'Assertion failed');
}
