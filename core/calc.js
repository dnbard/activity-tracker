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
    { speed: 8, cals: 37 },
    { speed: 16, cals: 133 },
    { speed: 24, cals: 349 },
    { speed: 32, cals: 742 },
    { speed: 40, cals: 1374 },
    { speed: 48, cals: 2303 }
];

exports.getCalories = function(distance, time){
    const averageSpeed = distance / time;

    const closestCalsValue = cals.map(c => {
        c.diff = Math.abs(c.speed - averageSpeed);
        return c;
    }).reduce((a, b) => a.diff > b.diff ? b : a);

    return closestCalsValue.cals * averageSpeed / closestCalsValue.speed * time;
}
