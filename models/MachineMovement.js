import mongoose from 'mongoose';

const machineMovementSchema = new mongoose.Schema({
  machineUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MachineUnit',
    required: true
  },
  fromLocationType: {
    type: String,
    enum: ['store', 'site', 'repair'],
    required: true
  },
  fromLocationId: {
    type: mongoose.Schema.Types.ObjectId, // siteId or null for store/repair
    default: null
  },
  toLocationType: {
    type: String,
    enum: ['store', 'site', 'repair'],
    required: true
  },
  toLocationId: {
    type: mongoose.Schema.Types.ObjectId, // siteId or null for store/repair
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed'],
    default: 'pending'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
    default: null
  },
  assignedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  movementDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('MachineMovement', machineMovementSchema);
