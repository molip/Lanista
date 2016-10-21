﻿namespace Util
{
    export function formatMoney(amount)
    {
        return '§' + amount;
    }

    export function getEventPos(event, element)
    {
        var rect = element.getBoundingClientRect();
        return new Point(event.clientX - rect.left, event.clientY - rect.top);
    }
    
    export function assert(condition, message?)
    {
        if (!condition)
            alert(message ? 'Assertion failed: ' + message : 'Assertion failed');
    }
}
