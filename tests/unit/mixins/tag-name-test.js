/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import TagNameMixin from 'ember-block-slots/mixins/tag-name'

describe('TagNameMixin', function () {
  it('sets tagName to span if the config.environement is "test"', function () {
    let TagNameObject = Ember.Object.extend(TagNameMixin)

    const testGetConfigEnvironment = function () {
      const config = Ember.Object.create({ environment: 'test' })
      return config
    }

    let subject = TagNameObject.create({ getConfigEnvironment: testGetConfigEnvironment })

    subject.setTagName()
    expect(subject.get('tagName')).to.be.eql('span')
  })

  it('sets tagName to span if the config.environement is "development"', function () {
    let TagNameObject = Ember.Object.extend(TagNameMixin)

    const testGetConfigEnvironment = function () {
      const config = Ember.Object.create({ environment: 'development' })
      return config
    }

    let subject = TagNameObject.create({ getConfigEnvironment: testGetConfigEnvironment })

    subject.setTagName()
    expect(subject.get('tagName')).to.be.eql('span')
  })

  it('sets tagName to empty if the config.environement not either "test" or "development"', function () {
    let TagNameObject = Ember.Object.extend(TagNameMixin)

    const testGetConfigEnvironment = function () {
      const config = Ember.Object.create({ environment: 'production' })
      return config
    }

    let subject = TagNameObject.create({ getConfigEnvironment: testGetConfigEnvironment })

    subject.setTagName()
    expect(subject.get('tagName')).to.be.eql('')
  })
})
