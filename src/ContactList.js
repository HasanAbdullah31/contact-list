import React from 'react';

class ContactList extends React.Component {
    static colors = ['#87CEFA', '#FF78BB', '#FFDF32', '#00FF7F', '#DEB887', '#A9A9A9'];
    render() {
        var colorIndex = -1;
        return (
            <div>
              {this.props.contacts.map((contact, i) => {
                  var color = '';
                  const image = contact['image'];
                  if (!image) color = ContactList.colors[++colorIndex % ContactList.colors.length];
                  return <Contact firstName={contact['firstName']}
                                  lastName={contact['lastName']}
                                  phone={contact['phone']}
                                  email={contact['email']}
                                  image={image} color={color}
                                  handleClick={this.props.handleClick}
                                  index={i} key={i} />;
              })}
            </div>
        );
    }
}

class Contact extends React.Component {
    render() {
        var circleStyle = {};
        if (this.props.image)
            circleStyle = {backgroundImage: 'url(' + this.props.image + ')'};
        else
            circleStyle = {backgroundColor: this.props.color};
        return (
            <div className="col-md-12 contact">
              <div className="col-md-1 pic">
                <div className="circle" style={circleStyle}>{!this.props.image && (this.props.firstName[0]+this.props.lastName[0]).toUpperCase()}</div>
              </div>
              <div className="col-md-9 info">
                <div className="name">{this.props.firstName} {this.props.lastName}</div>
                <div className="email">{this.props.email}</div>
              </div>
              <div className="col-md-2 btns">
                <div className="float-box">
                  <button className="btn btn-default btn-sm edit-contact-btn" type="button" onClick={() => this.props.handleClick('edit', this.props.index)} aria-label="Edit">
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                  </button>
                  <button className="btn btn-default btn-sm del-contact-btn" type="button" onClick={() => this.props.handleClick('del', this.props.index)} aria-label="Delete">
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
        );
    }
}

export default ContactList;
