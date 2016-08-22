import Ember from 'ember'
const {
  Component,
  computed
} = Ember
import layout from '../templates/components/yield-slot'
import { PropTypes } from 'ember-prop-types'
import TagName from '../mixins/tag-name'

/**
 * {{yield-slot}} provides a target for {{block-slot}} content
 *
 * Yield slots may also have a default, specified using the {{else}} helper
 * as per https://guides.emberjs.com/v2.6.0/components/block-params/#toc_supporting-both-block-and-non-block-component-usage-in-one-template
 *
 * e.g.
 *
 * // my-component.hbs
 * {{yield}}
 *
 * {{#yield-slot 'foo'}}
 *   {{yield}}
 * {{else}}
 *   <div>Default</div>
 * {{/yield-slot}}
 *
 * when used without a {{#block-slot 'foo'}}
 *
 * // my-route.hbs
 * {{my-component}}
 *
 * would result in DOM
 *
 * <div>Default</div>
 */
const YieldSlotComponent = Component.extend(TagName, {

  // == Component properties ==================================================

  layout,

  init () {
    // Once PR https://github.com/emberjs/ember.js/pull/14108 is merged, move setTagName()
    // after the call for this._super() and verify that Element Id is not set on a tagless
    // component causing an error on this assertion:
    // https://github.com/emberjs/ember.js/blame/3d25f9805cf1eb37a3f5ae6e05e3e2646b4f6175/packages/ember-htmlbars/lib/system/build-component-template.js#L42
    this.setTagName()
    this._super(...arguments)
  },

  // == State properties ======================================================

  propTypes: {
    _blockParams: PropTypes.array,
    // TODO better validation message
    // https://github.com/ciena-blueplanet/ember-prop-types/issues/15
    _name: PropTypes.string.isRequired
  },

  // == Computed properties ===================================================

  // A yield slot is considered active if a block slot registered a matching
  // name against the parent component with the Slots mixin
  isActive: computed('parentView._slots.[]', '_name', function () {
    return this.get('parentView._slots').contains(this.get('_name'))
  })
})

YieldSlotComponent.reopenClass({
  positionalParams: [ '_name', '_blockParams' ]
})

export default YieldSlotComponent
