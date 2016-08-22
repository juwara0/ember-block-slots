import Ember from 'ember'
const {
  Component,
  computed,
  defineProperty,
  isPresent,
  on
} = Ember
import layout from '../templates/components/block-slot'
import { PropTypes } from 'ember-prop-types'
import Slots from '../mixins/slots'
import YieldSlot from './yield-slot'
import TagName from '../mixins/tag-name'

/**
 * A block slot provides content for a target yield slot with a matching name
 *
 * e.g. {{#block-slot 'foo'}} would provide content for {{#yield-slot 'foo'}}
 *
 * Block slots may also use block params, see addon/helpers/block-params.js
 */
const BlockSlot = Component.extend(TagName, {

  // == Component properties ==================================================

  layout,

  // == State properties ======================================================

  propTypes: {
    isTargetSlotYielding: PropTypes.bool,
    // TODO better validation message
    // https://github.com/ciena-blueplanet/ember-prop-types/issues/15
    _name: PropTypes.string.isRequired,
    _yieldSlot: PropTypes.EmberObject
  },

  // == Events ================================================================

  init () {
    // Once PR https://github.com/emberjs/ember.js/pull/14108 is merged, move setTagName()
    // after the call for this._super() and verify that Element Id is not set on a tagless
    // component causing an error on this assertion:
    // https://github.com/emberjs/ember.js/blame/3d25f9805cf1eb37a3f5ae6e05e3e2646b4f6175/packages/ember-htmlbars/lib/system/build-component-template.js#L42
    this.setTagName()
    this._super(...arguments)

    // Active the yield slot using the slots interface
    const slottedComponent = this.nearestOfType(Slots)
    if (!slottedComponent._isRegistered(this._name)) {
      slottedComponent._activateSlot(this._name)
      // Store the slotted component for use during deactivation
      this.set('slottedComponent', slottedComponent)
      // Activation is done, the next pass will contain a local yieldSlot
      return
    }

    // Find the yield slot for this block
    const yieldSlot = this.nearestOfType(YieldSlot)

    if (yieldSlot) {
      // Store the activated yield slot for block params computed properties
      this.set('_yieldSlot', yieldSlot)

      // The slotted component will yield multiple times - once to register
      // the activate slots and once more per active slot - only display this
      // block when its associated slot is the one yielding
      const isTargetSlotYielding = yieldSlot._name === this._name
      this.set('isTargetSlotYielding', isTargetSlotYielding)

      // If the associated slot has block params, create a computed property
      // for each block param.  Technically this could be an unlimited, but
      // hbs lacks a spread operator so params are currently limited to 9
      // (see the yield in the block-slot template)
      //
      // Spread PR: https://github.com/wycats/handlebars.js/pull/1149
      if (isTargetSlotYielding && isPresent(yieldSlot._blockParams)) {
        // p0 p1 p2...
        yieldSlot._blockParams.forEach((param, index) => {
          defineProperty(this, `p${index}`,
            computed.readOnly(`_yieldSlot._blockParams.${index}`)
          )
        })
      }
    }
  },

  willDestroyElement () {
    this._super(...arguments)

    const slottedComponent = this.get('slottedComponent')
    if (slottedComponent) {
      // Deactivate the yield slot using the slots interface when the block
      // is destroyed to allow the yield slot default {{else}} to take effect
      // dynamically
      slottedComponent._deactivateSlot(this._name)
    }
  }
})

BlockSlot.reopenClass({
  positionalParams: [ '_name' ]
})

export default BlockSlot
