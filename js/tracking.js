(function ($) {
    "use strict";

    var SB_URL = 'https://ujcokrzjvjdrcrdhcnjy.supabase.co';
    var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY29rcnpqdmpkcmNyZGhjbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzA1MzksImV4cCI6MjA5OTk0NjUzOX0.SFgd7FP8lnkbIJ0CxoXXfD5-yo8XIyHGlOS_aK1J9-I';
    var sb = null;
    var map = null, marker = null, currentSub = null;

    function getSb(cb) {
        if (sb) { cb(sb); return; }
        var sc = document.getElementById('supabase-js');
        if (!sc) {
            sc = document.createElement('script');
            sc.id = 'supabase-js';
            sc.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            sc.onload = function () { sb = supabase.createClient(SB_URL, SB_KEY); cb(sb); };
            document.head.appendChild(sc);
        } else {
            var check = setInterval(function () {
                if (typeof supabase !== 'undefined') {
                    sb = supabase.createClient(SB_URL, SB_KEY);
                    cb(sb);
                    clearInterval(check);
                }
            }, 100);
        }
    }

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
        if (!data || !data.tracking_events) {
            $('#trackingResult').removeClass('d-block').addClass('d-none');
            $('#trackingError').text('Tracking number not found.').removeClass('d-none');
            return;
        }
        var html = '';
        $.each(data.tracking_events, function (i, u) {
            html += '<div class="timeline-item active">';
            html += '<div class="timeline-dot"></div>';
            html += '<div class="timeline-content">';
            html += '<h6 class="mb-1">' + u.title + '</h6>';
            html += '<small class="text-muted">' + new Date(u.event_time).toLocaleString() + '</small>';
            if (u.location) html += '<p class="mb-0 mt-1">' + u.location + '</p>';
            html += '</div></div>';
        });

        $('.tracking-timeline').html(html || '<div class="text-center py-4 text-muted">No tracking events yet.</div>');

        var labels = { pending: 'Pending', in_transit: 'In Transit', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', exception: 'Exception' };
        var colors = { pending: 'bg-warning text-dark', in_transit: 'bg-primary', out_for_delivery: 'bg-danger', delivered: 'bg-success', exception: 'bg-dark' };
        $('#statusBadge').text(labels[data.status] || data.status).removeClass().addClass('badge px-3 py-2 ' + (colors[data.status] || 'bg-secondary'));
        $('#trackingNumber').text(data.tracking_number || $('#trackingInput').val().trim().toUpperCase());
        $('#estDelivery').text(data.estimated_delivery ? new Date(data.estimated_delivery).toLocaleDateString() : '—');

        var originText = data.origin || '—';
        var destText = data.destination || '—';
        $('#trackingResult .col-lg-5 .bg-light .p-4:first strong').eq(0).text(originText);
        $('#trackingResult .col-lg-5 .bg-light .p-4:first strong').eq(1).text(destText);

        $('#trackingResult').removeClass('d-none').addClass('d-block');

        if (data.current_lat && data.current_lng) {
            setTimeout(function () {
                initMap(data.current_lat, data.current_lng, data.current_location || 'Current Location');
                if (map) setTimeout(function () { map.invalidateSize(); }, 100);
            }, 200);
        }
    }

    function subscribeToShipment(tn) {
        if (currentSub) { getSb(function (s) { s.removeChannel(currentSub); }); currentSub = null; }
        getSb(function (s) {
            s.from('shipments').select('tracking_number').eq('tracking_number', tn).single().then(function (r) {
                if (r.error || !r.data) return;
                var sid = r.data.tracking_number;
                currentSub = s.channel('pub-track-' + sid.replace(/[^a-zA-Z0-9]/g, ''))
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments', filter: 'tracking_number=eq.' + tn },
                        function () { doTrack(true); })
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tracking_events', filter: undefined },
                        function () { doTrack(true); })
                    .subscribe();
            });
        });
    }

    function doTrack(silent) {
        var num = $('#trackingInput').val().trim().toUpperCase();
        if (!silent) {
            $('#trackingError').addClass('d-none');
            if (!num) { $('#trackingError').removeClass('d-none'); return; }
        }
        getSb(function (s) {
            s.from('shipments').select('*,tracking_events(*)').eq('tracking_number', num).order('tracking_events.event_time', { ascending: false }).single().then(function (r) {
                if (r.error || !r.data) {
                    if (!silent) $('#trackingError').text('Tracking number not found.').removeClass('d-none');
                    return;
                }
                renderResult(r.data);
                subscribeToShipment(num);
            });
        });
    }

    $(document).ready(function () {
        var lcss = document.createElement('link');
        lcss.rel = 'stylesheet';
        lcss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(lcss);

        var ljs = document.createElement('script');
        ljs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(ljs);
    });

    $(document).on('click', '#trackBtn', function () { doTrack(false); });
    $(document).on('keypress', '#trackingInput', function (e) {
        if (e.which === 13) doTrack(false);
    });

})(jQuery);
