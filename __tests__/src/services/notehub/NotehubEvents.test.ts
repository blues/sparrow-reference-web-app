import { parseSparrowEvent, normalizeSparrowEventName, NormalizedEventName } from "../../../../src/services/notehub/SparrowEvents";



describe("NotehubEvents", () => {

    describe("Given a plain event name", () => {
        const eventName = "plain-event.qo";

        describe("calling NotehubEvents.normalizeSparrowEventName()", () => {
            let result: NormalizedEventName;

            beforeEach(() => {
                result = normalizeSparrowEventName(eventName);
            });

            it("returns undefined for the nodeID", () => {
                expect(result.nodeID).toBeUndefined();
            });

            it("returns the event name unmidifed", () => {
                expect(result.eventName).toBe(eventName);
            })
        });
    });

    describe("Given a Sparrow node encoded event name", () => {
        const normalizedEventName = "*#plain-event.qo";
        const basicEventName = "plain-event.qo";
        const nodeID = "AABBCCDDEEFFGG00";

        const eventName = `${nodeID}#${basicEventName}`;

        describe("calling NotehubEvents.normalizeSparrowEventName()", () => {
            let result: NormalizedEventName;

            beforeEach(() => {
                result = normalizeSparrowEventName(eventName);
            });

            it("returns undefined for the nodeID", () => {
                expect(result.nodeID).toBe(nodeID);
            });

            it("returns the normalized event name", () => {
                expect(result.eventName).toBe(normalizedEventName);
            })
        });
    });
});
