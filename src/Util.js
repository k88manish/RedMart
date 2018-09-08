import Config from "./Config";

const Util = {
    sort: function(data, prop) {
        if (data && Array.isArray(data) && data.length > 0) {
            data.sort((a, b) => {
                if (a[prop] < b[prop]) return -1;
                if (a[prop] > b[prop]) return 1;
                return 0;
            });
        } else {
            return data;
        }
    },

    getOverlappingEvents: function(events) {
        // Sort events based on start time
        Util.sort(events, "start");
        // Initiate list for overlapping events
        const overlappingEventsGroup = [];
        // Get all the overlapping events grouped
        let currentGroup;
        for (let i = 0; i < events.length; i++) {
            if (!currentGroup) {
                currentGroup = { start: events[i].start, end: events[i].end, events: [events[i]] };
                overlappingEventsGroup.push(currentGroup);
                continue;
            }

            // Check if event is overlapping
            let isOverlapping = false;
            if (currentGroup.start < events[i].start && currentGroup.end > events[i].start) {
                isOverlapping = true;
            }
            if (currentGroup.start < events[i].end && currentGroup.end > events[i].end) {
                isOverlapping = true;
            }
            // Check if event is overlapping then add to current group otherwise create new group
            if (isOverlapping) {
                currentGroup.events.push(events[i]);
                if (events[i].start < currentGroup.start) {
                    currentGroup.start = events[i].start;
                }
                if (events[i].end > currentGroup.end) {
                    currentGroup.end = events[i].end;
                }
            } else {
                currentGroup = { start: events[i].start, end: events[i].end, events: [events[i]] };
                overlappingEventsGroup.push(currentGroup);
            }
        }
        return overlappingEventsGroup;
    },

    calculateDimensionAndPosition: function(events) {
        const oge = Util.getOverlappingEvents(events);

        let updatedEvents = [];
        oge.forEach(group => {
            const eventWidth = Config.dayWidthInPx / group.events.length;

            group.events.forEach((event, index) => {
                event.top = this.getTotalDayHeight() - event.end * Config.minutesInPx;
                event.left = index * eventWidth;
                event.width = eventWidth;
                event.height = (event.end - event.start) * Config.minutesInPx;
            });

            updatedEvents = updatedEvents.concat(group.events);
        });
        return updatedEvents;
    },

    getTotalHours: function() {
        const totalHours = Config.dayEndTime - Config.dayStartTime;
        return totalHours;
    },

    getTotalDayHeight: function() {
        return this.getTotalHours() * 60 * Config.minutesInPx;
    }
};

export default Util;
