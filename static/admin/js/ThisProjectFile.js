let alarm = document.getElementById("alarmSound");
let alarmPlayed = false;
let watcherId = null;
let alarmStoppedManually = false;

function toRad(value) {
    return value * Math.PI / 180;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function stopAlarm() {
    alarm.pause();
    alarm.currentTime = 0;
    document.getElementById("stopBtn").style.display = "none";
    alarmPlayed = false;
    alarmStoppedManually = true;

    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
        watcherId = null;
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && !alarm.paused) {
        stopAlarm();
    }
});

document.getElementById("customAlarm").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        alarm.src = url;
        alarm.load();
    }
});

function startTracking() {
    const lat2 = parseFloat(document.getElementById("lat2").value);
    const lon2 = parseFloat(document.getElementById("lon2").value);
    const radius = parseFloat(document.getElementById("radius").value);

    if (isNaN(lat2) || isNaN(lon2) || isNaN(radius)) {
        alert("Please enter valid destination coordinates and proximity.");
        return;
    }

    alarmPlayed = false;
    alarmStoppedManually = false;
    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
    }

    if (navigator.geolocation) {
        watcherId = navigator.geolocation.watchPosition(position => {
            if (alarmStoppedManually) return;

            const lat1 = position.coords.latitude;
            const lon1 = position.coords.longitude;

            document.getElementById("status").textContent =
                `Your current location: ${lat1.toFixed(4)}, ${lon1.toFixed(4)}`;

            const distance = getDistance(lat1, lon1, lat2, lon2).toFixed(3);
            document.getElementById("distance").textContent =
                `Distance to destination: ${distance} km`;

            if (distance <= radius && !alarmPlayed) {
                alarm.play();
                alarmPlayed = true;
                document.getElementById("stopBtn").style.display = "inline";
                alert("You are within the specified proximity!");

                navigator.geolocation.clearWatch(watcherId);
                watcherId = null;
            }

        }, () => {
            document.getElementById("status").textContent = "Unable to access your location.";
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}