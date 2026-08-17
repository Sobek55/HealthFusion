const WeightHistory =
  require('../models/WeightHistory')

const getWeightHistory = async (
  req,
  res
) => {
  try {
    const history =
      await WeightHistory.findAllByUser(
        req.user.userId
      )

    return res.status(200).json({
      success: true,
      history
    })
  } catch (error) {
    console.error(
      'Get weight history error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve weight history'
    })
  }
}

const saveWeightEntry = async (
  req,
  res
) => {
  try {
    const {
      weight,
      recordedDate
    } = req.body

    const numericWeight =
      Number(weight)

    if (
      !Number.isFinite(
        numericWeight
      ) ||
      numericWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Weight must be greater than zero'
      })
    }

    if (
      !recordedDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        recordedDate
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'A valid recorded date is required'
      })
    }

    const entry =
      await WeightHistory.save(
        req.user.userId,
        numericWeight,
        recordedDate
      )

    return res.status(200).json({
      success: true,
      message:
        'Weight recorded successfully',
      entry
    })
  } catch (error) {
    console.error(
      'Save weight entry error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to save weight entry'
    })
  }
}

const deleteWeightEntry = async (
  req,
  res
) => {
  try {
    const weightEntryId =
      Number(
        req.params.weightEntryId
      )

    const deleted =
      await WeightHistory.delete(
        weightEntryId,
        req.user.userId
      )

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          'Weight entry not found'
      })
    }

    return res.status(200).json({
      success: true,
      message:
        'Weight entry deleted successfully'
    })
  } catch (error) {
    console.error(
      'Delete weight entry error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to delete weight entry'
    })
  }
}

module.exports = {
  getWeightHistory,
  saveWeightEntry,
  deleteWeightEntry
}