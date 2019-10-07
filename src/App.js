import React from 'react';
import ContactList from './ContactList';
import './App.css';
declare var $: any; // import jquery

class App extends React.Component {
    static buttonClicked = ''; // keeps track of whether to add or edit on clicking 'Save'
    static indexClicked = 0; // keeps track of which index to edit on clicking 'Save'

    constructor(props) {
        super(props);
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        this.state = {
            contacts: contacts ? contacts : []
        };
        this.handleClick = this.handleClick.bind(this);
        this.saveContact = this.saveContact.bind(this);
    }

    componentDidUpdate() {
        localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }

    sortContacts(contacts) {
        // Sort (case-insensitive) by first name and then by last name
        return contacts.sort((a, b) => {
            const aFirst = a['firstName'].toLowerCase();
            const bFirst = b['firstName'].toLowerCase();
            const aLast = a['lastName'].toLowerCase();
            const bLast = b['lastName'].toLowerCase();
            if (aFirst > bFirst) return 1;
            else if (aFirst === bFirst) {
                if (aLast > bLast) return 1;
                else return -1;
            }
            else return -1;
        });
    }

    handleClick(type, index) {
        if (type === 'del')
            this.deleteContact(index);
        else if (type === 'add') {
            App.buttonClicked = 'add';
            $('#contact-modal .circle').text('Add Photo');
            $('#contact-modal').modal('show');
        }
        else if (type === 'edit') {
            App.buttonClicked = 'edit';
            App.indexClicked = index;
            const contact = this.state.contacts[index];
            $('#first-name').val(contact['firstName']);
            $('#last-name').val(contact['lastName']);
            $('#phone').val(contact['phone']);
            $('#email').val(contact['email']);
            const image = contact['image'];
            if (image) $('#contact-modal .circle').css('background-image', 'url('+image+')');
            $('#contact-modal .circle').text('Change');
            $('#contact-modal').modal('show');
        }
    }

    saveContact() {
        const image = $('#contact-modal .circle').css('background-image').slice(4, -1);
        const contact = {
            'firstName': $('#first-name').val(),
            'lastName': $('#last-name').val(),
            'phone': $('#phone').val(),
            'email': $('#email').val(),
            'image': image ? image : ''
        };
        // Validate inputs
        if (contact['firstName'] && contact['lastName']) {
            const phonePattern = /^[+]?[0-9- ]{7,}$/;
            const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
            if (!phonePattern.test(contact['phone']))
                window.alert('Invalid phone input. Try again.');
            else if (!emailPattern.test(contact['email'].toLowerCase()))
                window.alert('Invalid email input. Try again.');
            else {
                if (App.buttonClicked === 'add') {
                    this.setState((state) => {
                        var newContacts = state.contacts;
                        newContacts.push(contact);
                        return { contacts: this.sortContacts(newContacts) };
                    });
                }
                else if (App.buttonClicked === 'edit') {
                    this.setState((state) => {
                        var newContacts = state.contacts;
                        newContacts[App.indexClicked] = contact;
                        return { contacts: this.sortContacts(newContacts) };
                    });
                }
                $('#contact-modal').modal('hide');
            }
        }
        else
            window.alert('Invalid name input. Try again.');
    }

    deleteContact(index) {
        if (window.confirm('Are you sure? This action cannot be undone.')) {
            this.setState((state) => {
                var newContacts = state.contacts;
                newContacts.splice(index, 1);
                return { contacts: newContacts };
            });
        }
    }

    render() {
        return (
            <div>
              <div id="header" className="container">
                My Contacts
                <button id="add-contact-btn" className="btn btn-default btn-lg pull-right" type="button" onClick={() => this.handleClick('add')} aria-label="Add">
                  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button><hr/>
              </div>
              <div id="contact-list" className="container">
                <ContactList contacts={this.state.contacts}
                             handleClick={this.handleClick} />
              </div>
              <div id="contact-modal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="add-contact" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button className="btn modal-btn pull-left" type="button" data-dismiss="modal" aria-label="Cancel">Cancel</button>
                      <button id="save-contact-btn" className="btn modal-btn pull-right" type="button" onClick={this.saveContact} aria-label="Save">Save</button>
                    </div>
                    <div className="modal-body">
                      <div className="col-md-12 info-box">
                        <div className="col-md-4 info">
                          <div className="circle"></div>
                        </div>
                        <div className="col-md-8 info">
                          <input id="first-name" className="input-lg" type="text" maxLength="20" placeholder="First Name" aria-label="First Name" /><br/>
                          <input id="last-name" className="input-lg" type="text" maxLength="20" placeholder="Last Name" aria-label="Last Name" />
                        </div>
                      </div>
                      <div className="col-md-12 info-box">
                        <div className="col-md-12 info">
                          <label htmlFor="phone">phone:</label><input id="phone" className="input-lg" type="tel" maxLength="15" placeholder="+1 917 000 0000" aria-label="Phone" />
                        </div>
                        <div className="col-md-12 info">
                          <label htmlFor="email">e-mail:</label><input id="email" className="input-lg" type="email" maxLength="40" placeholder="example@gmail.com" aria-label="Email" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

$(document).ready(function() {
    //https://getbootstrap.com/docs/3.3/javascript/#modals
    $('#contact-modal').on('hidden.bs.modal', function() {
        $('#contact-modal input').val('');
        $('#contact-modal .circle').css('background-image', '');
    });
    //https://cloudinary.com/documentation/upload_widget
    const uploadImageWidget = window.cloudinary.createUploadWidget(
        {
            cloudName: 'hasanabdullah31',
            uploadPreset: 'contact-list-app',
            multiple: false,
            resourceType: 'image',
            maxFileSize: 12000000, // 12MB
            theme: 'white'
        },
        (error, result) => {
            if (!error && result && result.event === 'success') {
                const imageUrl = result.info['secure_url'];
                $('#contact-modal .circle').css('background-image', 'url('+imageUrl+')');
            }
        }
    );
    $('#contact-modal .circle').on('click', function() {
        uploadImageWidget.open();
    });
});

export default App;
