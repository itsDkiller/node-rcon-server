class BasePacket {

    #size
    #buffer

    /**@param {number} id   Unique client-chosen packet ID
     * @param {number} type Indicates the purpose of the packet
     * @param {string|buffer} body ASCII: packet content
    */
    constructor(id, type, body) {
        this.id      = id;
        this.type    = type;
        this.body    = body;
        this.#size   = Buffer.byteLength(this.body) + 14;
        this.#buffer = Buffer.alloc(this.#size);
        this.packet  = this.#writeDataToBuffer(this.#buffer);
    }

    /**Function inspired by Speedhaxx (https://developer.valvesoftware.com/wiki/User:Speedhaxx)
     * @param {buffer} packet_buffer
     * @returns {buffer} */
    #writeDataToBuffer = (packet_buffer) => {
        packet_buffer.writeInt32LE(this.#size - 4, 0);
	    packet_buffer.writeInt32LE(this.id, 4);
	    packet_buffer.writeInt32LE(this.type, 8);
        packet_buffer.write(this.body, 12, this.#size - 2, "ascii");
        packet_buffer.writeInt16LE(0, this.#size - 2);
        
        return packet_buffer;
    }
}

/** Sent by the client, used to authenticate the connection with the server */
class ServerDataAuthPacket extends BasePacket {

    /**
     * @param {number} id   Unique client-chosen packet ID
     * @param {string|buffer} body ASCII: packet content
     */
    constructor(id, body) {
        super(id, 3, body);
    }

    /** Original packet type name */
    identifier = "SERVERDATA_AUTH";
}

/** Notificational packet for the current status of authentication */
class ServerDataAuthResponsePacket extends BasePacket {

    /**
     * @param {number} id   Unique client-chosen packet ID
     * @param {string|buffer} body ASCII: packet content
    */
    constructor(id, body) {
        super(id, 2, body);
    }

    /** Original packet type name */
    identifier = "SERVERDATA_AUTH_RESPONSE";
}

/** Contains a command sent by the client to the server */
class ServerDataExecCommandPacket extends BasePacket {

    /**
     * @param {number} id   Unique client-chosen packet ID
     * @param {string|buffer} body ASCII: packet content
     */
    constructor(id, body) {
        super(id, 2, body);
    }

    /** Original packet type name */
    identifier = "SERVERDATA_EXECCOMMAND";
}

/** Response packet for executed commands */
class ServerDataResponseValuePacket extends BasePacket {

    /**
     * @param {number} id   Unique client-chosen packet ID
     * @param {string|buffer} body ASCII: packet content
     */
    constructor(id, body) {
        super(id, 0, body);
    }

    /** Original packet type name */
    identifier = "SERVERDATA_RESPONSE_VALUE";
}

/** Class to handle a incoming buffer server-side and parse it into an object */
class ClientResponse {

    /**@param {buffer} data The incoming buffer */
    constructor(data) {
        this.data = this.#parseResponseBuffer(data);
    }

    /**Function to convert the buffer into an object
     * @param {buffer} buffer The incoming buffer
     * @returns {object} response
     */
    #parseResponseBuffer = (buffer) => {
        var response = {
            size: buffer.readInt32LE(0),
            id:   buffer.readInt32LE(4),
            type: buffer.readInt32LE(8),
            body: buffer.toString("ascii", 12, buffer.length - 2)
        }
        return response;
    }
}

module.exports = {
    ServerDataAuthPacket,
    ServerDataAuthResponsePacket,
    ServerDataExecCommandPacket,
    ServerDataResponseValuePacket,
    ClientResponse
}