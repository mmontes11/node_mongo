import httpStatus from 'http-status';
import Measurement from '../models/measurementModel';
import requestUtils from '../utils/requestUtils'

function createMeasurement(req, res) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const measurement = new Measurement({
        creator: {
            userName: userName,
            device: req.body.device
        },
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        units: req.body.units,
        value: req.body.value
    });

    measurement.save()
        .then( savedMeasurement => res.json(savedMeasurement) )
        .catch( err => {
            res.status(httpStatus.BAD_REQUEST).json(err);
        })
}

export default { createMeasurement };