(function ($) {
    "use strict";

    var sampleData = {
        "NXT-2024-001": {
            status: "In Transit",
            statusBadge: "bg-primary",
            estimated: "Jul 20, 2026",
            origin: "Miami, FL",
            destination: "Orlando, FL",
            location: { lat: 28.5383, lng: -81.3792, name: "Orlando" },
            updates: [
                { title: "Package Picked Up", time: "Jul 16, 2026 - 09:30 AM", place: "Distribution Hub, Miami", done: true },
                { title: "In Transit", time: "Jul 17, 2026 - 02:15 PM", place: "Sorting Center, Orlando", done: true },
                { title: "Out for Delivery", time: "Pending", place: "Local Delivery Hub", done: false },
                { title: "Delivered", time: "Pending", place: "Destination", done: false }
            ]
        },
        "NXT-2024-002": {
            status: "Delivered",
            statusBadge: "bg-success",
            estimated: "Jul 15, 2026",
            origin: "Jacksonville, FL",
            destination: "Tampa, FL",
            location: { lat: 27.9506, lng: -82.4572, name: "Tampa" },
            updates: [
                { title: "Package Picked Up", time: "Jul 12, 2026 - 08:00 AM", place: "Warehouse, Jacksonville", done: true },
                { title: "In Transit", time: "Jul 13, 2026 - 11:30 AM", place: "Transit Hub, Gainesville", done: true },
                { title: "Out for Delivery", time: "Jul 14, 2026 - 07:00 AM", place: "Local Hub, Tampa", done: true },
                { title: "Delivered", time: "Jul 14, 2026 - 02:45 PM", place: "Downtown, Tampa", done: true }
            ]
        },
        "NXT-2024-003": {
            status: "Out for Delivery",
            statusBadge: "bg-warning text-dark",
            estimated: "Jul 17, 2026",
            origin: "Fort Lauderdale, FL",
            destination: "West Palm Beach, FL",
            location: { lat: 26.7153, lng: -80.0534, name: "West Palm Beach" },
            updates: [
                { title: "Package Picked Up", time: "Jul 15, 2026 - 10:00 AM", place: "Warehouse, Fort Lauderdale", done: true },
                { title: "In Transit", time: "Jul 16, 2026 - 09:00 AM", place: "Sorting Center, Boca Raton", done: true },
                { title: "Out for Delivery", time: "Jul 17, 2026 - 08:30 AM", place: "Local Hub, West Palm Beach", done: true },
                { title: "Delivered", time: "Pending", place: "Destination", done: false }
            ]
        }
    };

    var map = null;
    var marker = null;

    function initMap(lat, lng, label) {
        if (!map) {
            map = L.map('trackingMap').setView([lat, lng], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);
        }
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup("<b>" + label + "</b>").openPopup();
        map.setView([lat, lng], 10, { animate: true });
    }

    function renderResult(data) {
        var html = '';
        $.each(data.updates, function (i, u) {
            var active = u.done ? 'active' : '';
            html += '<div class="timeline-item ' + active + '">';
            html += '<div class="timeline-dot"></div>';
            html += '<div class="timeline-content">';
            html += '<h6 class="mb-1">' + u.title + '</h6>';
            html += '<small class="text-muted">' + u.time + '</small>';
            html += '<p class="mb-0 mt-1">' + u.place + '</p>';
            html += '</div></div>';
        });
        $('.tracking-timeline').html(html);

        $('#statusBadge').text(data.status).removeClass().addClass('badge px-3 py-2 ' + data.statusBadge);
        $('#trackingNumber').text($('#trackingInput').val().trim().toUpperCase());
        $('#estDelivery').text(data.estimated);
        $('#trackingResult').removeClass('d-none').addClass('d-block');

        $('#trackingResult').find('.col-lg-5 .bg-light .p-4:first strong').eq(0).text(data.origin);
        $('#trackingResult').find('.col-lg-5 .bg-light .p-4:first strong').eq(1).text(data.destination);

        setTimeout(function () {
            initMap(data.location.lat, data.location.lng, data.location.name);
            if (map) setTimeout(function () { map.invalidateSize(); }, 100);
        }, 200);
    }

    function doTrack() {
        var num = $('#trackingInput').val().trim().toUpperCase();
        $('#trackingError').addClass('d-none');
        if (!num) {
            $('#trackingError').removeClass('d-none');
            return;
        }
        if (sampleData[num]) {
            renderResult(sampleData[num]);
        } else {
            $('#trackingError').text('Tracking number not found. Try NXT-2024-001, NXT-2024-002, or NXT-2024-003.').removeClass('d-none');
        }
    }

    $(document).ready(function () {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);
    });

    $(document).on('click', '#trackBtn', doTrack);
    $(document).on('keypress', '#trackingInput', function (e) {
        if (e.which === 13) doTrack();
    });

})(jQuery);