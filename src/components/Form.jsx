import React, { Component } from 'react'
import FormFields from './FormFields'
import { connect } from 'react-redux'
import { getCountries } from '../redux/actions'

class Form extends Component {
  state = {
    ssn: '',
    phone: '',
    email: '',
    country: 'Afghanistan',
    errors: {
      ssn: '',
      phone: '',
      email: '',
    },
    errorMessage: null
  }

  componentDidMount() {
    this.props.getCountries()
  }

  validEmail = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)

  ssnRegex = /^(19|20)?\d{2}((0[1-9])|(1[012]))(([012][1-9])|(3[01]))-\d{4}$/
  validSsn = ssn => this.ssnRegex.test(ssn)

  phoneRegex = /^([+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$/
  validPhone = phone => this.phoneRegex.test(phone)

  handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    let errors = this.state.errors

    switch (name) {
      case 'ssn':
        errors.ssn = 
          this.validSsn(value)
            ? ''
            : 'Please enter a valid personal number!'
        break
      case 'phone':
        errors.phone =
          this.validPhone(value)
            ? ''
            : 'Please enter a valid phone number!'
        break
      case 'email':
        errors.email =
          this.validEmail.test(value)
            ? ''
            : 'Please enter a valid email address!'
        break
      default:
        break
    }

    this.setState({
      [name]: value,
      errors, [name]: value
    })
  }

  validateForm = (errors) => {
    let valid = true
    Object.values(errors).forEach(
      val => val.length > 0 && (valid = false)
    )
    return valid
  }

  handleSubmit = async e => {
    e.preventDefault()

    if(this.validateForm(this.state.errors) && this.state.ssn !== '' && this.state.phone !== '' && this.state.email !== '' && this.state.country !== '') {
      console.log('Success')
    } else {
      this.setState({
        errorMessage: 'Please make sure that all fields contain valid information.'
      })
      console.log('Oops, something went wrong!')
    }
  }

  render() {
    let { remoteCountries } = this.props
    let options

    if (remoteCountries.length > 0) {
      options = remoteCountries.map(rc => {
        return (
          <option key= {rc.name} value={rc.name}>{rc.name}</option>
        )
      })
    }

    return (
      <>
        <FormFields 
          options = {options}
          ssn = {this.state.ssn}
          phone = {this.state.phone}
          email = {this.state.email}
          country = {this.state.country}
          errors = {this.state.errors}
          handleChange = {this.handleChange}
          handleSubmit = {this.handleSubmit}
        />
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    remoteCountries: state.countryReducer.remoteCountries
  }
}

export default connect(mapStateToProps, { getCountries })(Form)