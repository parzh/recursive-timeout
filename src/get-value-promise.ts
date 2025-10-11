import { promisify } from 'util'
import { getValue as getValueCb } from './get-value-callback'

export const getValue = promisify(getValueCb)
