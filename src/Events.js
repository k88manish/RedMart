import React, { Component } from "react";
import EventData from "./EventData";
import Util from "./Util";
import Config from "./Config";

class Events extends Component {
    constructor(props) {
        super(props);
        const updatedEvents = Util.calculateDimensionAndPosition(EventData);
        this.state = {
            events: updatedEvents
        };
        this.totalHeight = Util.getTotalDayHeight();
        this.totalHours = Util.getTotalHours();
        this.hours = [];
        for (let i = 0; i < this.totalHours; i++) {
            this.hours.push(i + Config.dayStartTime);
        }
    }

    getListItemStyle = () => {
        const liHeight = this.totalHeight / this.hours.length;
        return { height: liHeight, color: "blue" };
    };

    render() {
        const { events } = this.state;
        this.hours = this.hours.reverse();
        const listItemStyle = this.getListItemStyle();
        return (
            <div className="content">
                <div style={{ height: this.totalHeight, width: 100 }}>
                    <ul>
                        {this.hours.map(e => (
                            <li key={e} style={listItemStyle}>
                                <span>{`${e}:00 --`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ height: this.totalHeight, width: Config.dayWidthInPx }} className="timeline">
                    {events.map((event, index) => {
                        return (
                            <div
                                className="event"
                                key={index}
                                style={{
                                    height: event.height - 2,
                                    position: "absolute",
                                    top: event.top,
                                    left: event.left,
                                    width: event.width - 2
                                }}
                            >
                                <span>{event.id}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Events;
