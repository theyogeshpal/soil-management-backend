import MachineMovement from '../models/MachineMovement.js';
import MachineUnit from '../models/MachineUnit.js';

// @desc    Get all movements
// @route   GET /api/movements
export const getMovements = async (req, res) => {
  try {
    const movements = await MachineMovement.find()
      .populate({
        path: 'machineUnitId',
        populate: { path: 'machineTypeId', select: 'name category' }
      })
      .populate('fromLocationId', 'name address')
      .populate('toLocationId', 'name address')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('operatorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: movements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request movement
// @route   POST /api/movements
export const requestMovement = async (req, res) => {
  try {
    const { machineUnitId, fromLocationType, fromLocationId, toLocationType, toLocationId, notes, operatorId, assignedUserId } = req.body;

    const unit = await MachineUnit.findById(machineUnitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Machine unit not found' });
    }

    if (unit.status !== 'available' && unit.status !== 'assigned') {
      return res.status(400).json({ success: false, message: `Cannot move machine in ${unit.status} status` });
    }

    const movement = await MachineMovement.create({
      machineUnitId,
      fromLocationType,
      fromLocationId: fromLocationId || null,
      toLocationType,
      toLocationId: toLocationId || null,
      status: 'pending',
      requestedBy: req.user.id,
      notes,
      operatorId: operatorId || null,
      assignedUserId: assignedUserId || null
    });

    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve movement
// @route   PUT /api/movements/:id/approve
export const approveMovement = async (req, res) => {
  try {
    const movement = await MachineMovement.findById(req.params.id);
    if (!movement) {
      return res.status(404).json({ success: false, message: 'Movement not found' });
    }

    if (movement.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Movement is not pending' });
    }

    const unit = await MachineUnit.findById(movement.machineUnitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Machine unit not found' });
    }

    // Fix stale invalid condition values
    const validConditions = ['good', 'damaged', 'maintenance'];
    if (!validConditions.includes(unit.condition)) {
      unit.condition = 'good';
    }

    // Logic for updating the unit
    if (movement.toLocationType === 'supervisor') {
      unit.status = 'available';
      unit.currentSiteId = null;
      unit.assignedUserId = null;
      unit.preAssignedUserId = movement.assignedUserId || null;
      unit.operatorId = movement.operatorId || null;
    } else if (movement.toLocationType === 'repair') {
      unit.status = 'repair';
      unit.currentSiteId = null;
      unit.assignedUserId = null;
      unit.operatorId = null;
    } else if (movement.toLocationType === 'store') {
      unit.status = 'available';
      unit.currentSiteId = null;
      unit.assignedUserId = null;
      unit.preAssignedUserId = null;
      unit.operatorId = null;
    }

    await unit.save();

    movement.status = 'approved';
    movement.approvedBy = req.user.id;
    movement.movementDate = new Date();
    await movement.save();

    res.status(200).json({ success: true, data: movement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete movement
// @route   PUT /api/movements/:id/complete
export const completeMovement = async (req, res) => {
  try {
    const movement = await MachineMovement.findById(req.params.id);
    if (!movement) {
      return res.status(404).json({ success: false, message: 'Movement not found' });
    }

    movement.status = 'completed';
    await movement.save();

    res.status(200).json({ success: true, data: movement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
