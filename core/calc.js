const DEFAULT_WEIGHT = 59;
const FLAT_COEF = 1.22;
const MINUTES_IN_HOUR = 60;

exports.oldScoreToKM = function(score){
    var km = 0;

    switch(score){
        case 1: km = 6; break;
        case 2: km = 13; break;
        case 3: km = 18; break;
        case 4: km = 23; break;
        case 5: km = 33; break;
    }

    return km;
}

const cals = [
    { speed: 8, cals: 235 },
    { speed: 16, cals: 472 },
    { speed: 24, cals: 590 },
    { speed: 32, cals: 720 },
    { speed: 40, cals: 944 }
]; //weight 59 kg

exports.getCalories = function(distance, time, weight){
    const averageSpeed = distance / time / MINUTES_IN_HOUR;
    const weightMod = weight ? weight / DEFAULT_WEIGHT / FLAT_COEF : 1;

    const closestCalsValue = cals.map(c => {
        c.diff = Math.abs(c.speed - averageSpeed);
        return c;
    }).reduce((a, b) => a.diff > b.diff ? b : a);

    return closestCalsValue.cals * averageSpeed / closestCalsValue.speed * time * weightMod / MINUTES_IN_HOUR
}
