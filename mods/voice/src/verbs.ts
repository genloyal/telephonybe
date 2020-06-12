import Say from './say'
import Play from './play'
import Wait from './wait'
import Record from './record'
import Gather from './gather'

/**
 * @classdescNode JS Implementation of the Verbs API.
 */
class Verbs {
  channel: any
  _config: any
  callDetailRecord: {
    ref: any
    date: Date
    from: any
    to: any
    created: Date
    modified: Date
    start: Date
    end: Date
    duration: number
    vars: Map<any, any>
  }
  /**
   * Constructs a new Verbs object.
   * @params {Channel} channel - Channel object pass from AGI-Node
   * @params {Object} config - This parameter is required for proper operation
   * of some verbs, such as `Say`.
   * @params {Storage} config.storage - An instance of the Storage object
   * @params {TTS} config.tts - An instance of a TTS engine implementation
   */
  constructor (channel: any, config?: any) {
    const objectid = require('objectid')
    this.channel = channel
    this._config = config
    this.callDetailRecord = {
      ref: objectid(),
      date: new Date(),
      from: channel.request.callerid,
      to: channel.request.extension,
      created: new Date(),
      modified: new Date(),
      start: new Date(),
      end: new Date(),
      duration: 0,
      vars: new Map()
      // TODO
      //answerBy
      //userRef,
      //appRef,
      //direction,
      //status,
      //cost,
      //billable
    }
  }

  /**
   * Configure the Verbs object.
   *
   * @param {Object} config - This parameter is required for proper operation of
   * some verbs, such as `Say`
   * @param {string} config.bucket - Change default bucket
   * @param {string} config.storage - A replacement for the storage. Use this
   * Only to overwrite the parameters set in your `fonos.json.`
   * @param {string} config.tts - A replacement for the default TTS engine
   */
  config (config: any) {
    this._config = config
  }

  /**
   * Answer a call if not already answered.
   */
  answer () {
    return this.channel.answer()
  }

  /**
   * Terminates a call if not already terminated.
   */
  hangup () {
    return this.channel.hangup()
  }

  /**
   * Terminates at `timeout`
   */
  setAutoHangup (timeout: number) {
    new Error('not yet implemented')
    return this.channel.setAutoHangup(timeout)
  }

  /**
   * Plays an audio in the calls channel.
   *
   * @param {string} file - Is a file that has been previously uploaded or is
   * available by default in the applications bucket.
   * @param {Object} options - Optional parameters to alter the command's normal
   * behavior
   * @param {string} options.finishOnKey - Key to terminate the playing
   * @returns {string} Pressed key or undefined if no key was pressed before
   * timeout
   * @example
   *
   * const options {
   *   finishOnKey: '#'',
   * }
   *
   * const result = chan.play('tts-monkeys', options)
   */
  play (file: string, options?: any): string {
    return new Play(this.channel, this._config).run(file, options)
  }

  /**
   * Sythentizes a text and streams the resulting audio.
   *
   * @param {string} text - Will be convert into a file and put in a cache for
   * future use.
   * @param {Object} options - Optional parameters to alter the command's normal behavior.
   * @param {string} options.finishOnKey - Key to terminate the playing
   * @returns {string} Pressed key or undefined if no key was pressed before
   * timeout
   * @example
   *
   * const options {
   *   finishOnKey: '#'',
   * }
   *
   * const result = chan.say('hello, this is an audio sample', options)
   */
  say (text: string, options?: any): string {
    return new Say(this.channel, this._config).run(text, options)
  }

  /**
   * Plays a silence for `time` seconds.
   *
   * @params {number} time - A time seconds to wait for
   */
  wait (time: number): void {
    new Wait(this._config, this.channel).run(time)
  }

  /**
   * The Gather verb is used in combination with Play, Say, Wait.
   *
   * @param {string} text - Will be convert into a file and put in a cache for
   * future use.
   * @param {Object} options - Optional parameters to alter the command's normal
   * behavior.
   * @param {string} options.timeout - Time to finish if no key is pressed
   * @param {string} options.finishOnKey - Key to terminate the playing
   * @param {string} options.maxDigits - Max number of digits accepted
   * @returns {string} Pressed digits or undefined if no keys were pressed before
   * timeout
   * @example
   *
   * const options {
   *   finishOnKey: '#'',
   *   maxDigits: 4
   * }
   *
   * const result = chan.gather(chan.say('this is an audio sample'), options)
   */
  gather (initDigits: string, options?: any): string {
    return new Gather(this.channel).run(initDigits, options)
  }

  /**
   * Record creates a file with the sound send by receiving device
   *
   * @param {string} text - Will be convert into a file and put in a cache for
   * future use.
   * @param {Object} options - Optional parameters to alter the command's normal
   * behavior.
   * @param {string} options.timeout - Time to finish if no key is pressed
   * @param {string} options.finishOnKey - Key to terminate the playing
   * @param {string} options.beep - Wether to beep or not before beginig the
   * recordings. Defaults to 'false'
   * @param {string} options.offset - Causes the recording to first seek to the
   * specified offset before recording begins
   * @param {string} options.maxDuration - Maximum duration of the recording.
   * Defaults to `1 hour.`
   * @returns {string} Metadata with information about the recordings
   * @todo Add constrains for the file's format
   * @example
   *
   * const options = {
   *     timeout: 4,         // Default
   *     finishOnKey: #,     // Characters used to finish the recording
   *     beep: true,
   *     offset: 0,
   *     maxDuration: 3600   // Maximum duration in seconds
   * }
   *
   * const result = chan.record(options)
   */
  record (options?: any): any {
    return new Record(this.channel).run(this.callDetailRecord, options)
  }

  /**
   * Saves a set of key,value in the Call Detail Record.
   *
   * @example
   *
   * chan.stash('choice', chan.say('enter your option'))
   */
  stash (key: string, value: string) {
    this.callDetailRecord.vars.set(key, value)
  }

  getCallDetailRecord () {
    return this.callDetailRecord
  }
}

export default Verbs