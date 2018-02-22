/*global vex */

var logger = $('#logger-area');
vex.defaultOptions.className = 'vex-theme-os';

function log(message, isError) {
    logger.append("<p style='color: "+ ((isError) ? "#F00" : "#00F") +"'>" + message + "</p>");
    vex.dialog.alert('<p style="color:#3288e6">' + message);
}

function logDraw(player) {
    var message = "Player "+ player +" comprou uma carta";
    log(message, false);
}

function logSummon(player, monster) {
    var message = "Player "+ player +" invocou " + monster.id + ": " + monster.name + "[" + monster.power + "|" + monster.life + "]";
    log(message, false);
}

function logAttack(player, attacker, defender, destroyed) {
    var message = "Player " + player +" ataca com |" + attacker.id + ":" + attacker.name + "| o monstro |" + 
            defender.id + ":" + defender.name + "|" + ((destroyed) ? " que é destruído" : "");
    log(message, false);
}