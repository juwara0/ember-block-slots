import Ember from 'ember'
const { Mixin, set } = Ember

export default Mixin.create({
  getConfigEnvironment () {
    return Ember.getOwner(this).resolveRegistration('config:environment')
  },

  setTagName () {
    const config = this.getConfigEnvironment()
    console.log('config: ', config)
    const tag = (config.environment === 'test' || config.environment === 'development') ? 'span' : ''
    set(this, 'tagName', tag)
  }
})
