import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import * as firebase from 'firebase';
export default class App extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      fbid: '',
      submitBtnName:'FB Login',
      city:'Tainan',
      isSubmitted: false,
      key:''
    };
    this.testAPI = this.testAPI.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="info">
            <h1>Weather Robot</h1><span>Made with <i class="fa fa-heart"></i> by <a href="http://andytran.me">Jerry Wang</a></span>
          </div>
        </div>
        <div className="form">
          <div className="thumbnail"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/hat.svg"/></div>
          <form className="login-form" role="form" onSubmit={this.handleLogin}>
            <input type="text" value={this.state.name} placeholder="Name"/>
            <input type="text" value={this.state.fbid} placeholder="FB_ID"/>
            <div className="form-group">
              <select className="form-control" value={this.state.city} onChange={this.handleChange}>
                <option value="Keelung">基隆</option>
                <option value="Taipei">台北</option>
                <option value="Taoyuan">桃園</option>
                <option value="Hsinchu">新竹</option>
                <option value="Taichung">台中</option>
                <option value="Tainan">台南</option>
                <option value="Kaohsiung">高雄</option>
                <option value="Hualien">花蓮</option>
                <option value="Taitung">台東</option>
              </select>
            </div>
            <button type="submit">{this.state.submitBtnName}</button>
          </form>
        </div>
      </div>
    );
  }

   componentDidMount() {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1796462227274813',
          cookie     : true,  // enable cookies to allow the server to access
                            // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.8' // use version 2.1
        });

        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into
        //    your app or not.
        //
        // These three cases are handled in the callback function.
        FB.getLoginStatus(function(response) {
          this.statusChangeCallback(response);
        }.bind(this));
      }.bind(this);

      // Load the SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    testAPI() {
      self = this;
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name + response.id);
        self.setState({
          name:response.name,
          fbid:response.id,
          submitBtnName:'submit',
          isSubmitted:true
        });

        if(self.state.isSubmitted){
          self.handleSubmit();
        }
        
        });
    }

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        this.testAPI();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('Please log ' +
        'into this app.');
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log ' +
        'into Facebook.');
      }
  }

  handleLogin = (e) => {
    e.preventDefault();
    FB.login(this.checkLoginState());
  }

  checkLoginState = ()=> {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  handleSubmit = () => {
    //write in to firebase
    console.log('tests'+this.state.name);
    //name fbid city
    const self = this;
    const firebaseRef = firebase.database().ref();
    
    const peopleRef = firebaseRef.child('people');
    
    peopleRef.on('child_added',(snapshot)=>{
      //push weather robot to user
      console.log('add new child', snapshot.val());
    });

    peopleRef.on('value',(snapshot)=>{
      //call eather robot
      const obj = snapshot.val();
      let needUpdate = false;
      if(obj){
          Object.keys(obj).map(function(objectKey, index) {
            const value = obj[objectKey];
            if(value.fbid == self.state.fbid){
              needUpdate = true;
              self.setState({
                key:objectKey
              })
              return;
            }
          });
          if(needUpdate){//update
            let updatePeopleRef = firebaseRef.child(`people/${self.state.key}`);
            updatePeopleRef.update({
              city:self.state.city
            }).then(()=>{
              console.log('city has changed');
            })
          }else{//insert
            let newPeopleRef = peopleRef.push( {
              name:self.state.name,
              city:self.state.city,
              fbid:self.state.fbid
            }).then(()=>{
              self.setState({
              key:newPeopleRef.key
              })
              console.log('insert key:'+newPeopleRef.key);
            });
          }
      }else{//insert
        let newPeopleRef = peopleRef.push( {
              name:self.state.name,
              city:self.state.city,
              fbid:self.state.fbid
            }).then(()=>{
              self.setState({
              key:newPeopleRef.key
              })
              console.log('insert key:'+newPeopleRef.key);
            });
      }
      
      //////////


      // if(obj){
      //   let arr = Object.keys(obj).map(key => obj[key]);
      //   let needUpdate = false;
      //   arr.map(function(item){
      //     if(item.fbid == self.state.fbid){
      //       needUpdate = true;
      //       return;
      //     }
      //   });
      //   if(needUpdate){//update
      //     console.log('need update');
      //   }else{//insert
      //     console.log('need insert');
      //     let newPeopleRef = peopleRef.push( {
      //       name:self.state.name,
      //       city:self.state.city,
      //       fbid:self.state.fbid
      //     });
      //     console.log('insert key:'+newPeopleRef.key);
      //   }
      // }else{
      //   //insert
      //   let newPeopleRef = peopleRef.push( {
      //     name:self.state.name,
      //     city:self.state.city,
      //     fbid:self.state.fbid
      //   }).then(()=>{
      //     self.setState({
      //      key:newPeopleRef.key
      //     })
      //     console.log('insert key:'+newPeopleRef.key);
      //   });
        
      // }
      
        // if(item.fbid == self.state.fbid){
        //   //update
        //   console.log('update');
        //   // peopleRef.update(
        //   //   {
        //   //     city:self.state.city
        //   //   }
        //   // )
        //   return;
        // }else{
        //   //insert
        //   let newPeopleRef = peopleRef.push( {
        //     name:self.state.name,
        //     city:self.state.city,
        //     fbid:self.state.fbid
        //   });
        //   console.log('insert key:'+newPeopleRef.key);
        //   return;
        // }
      
    });
    

    
  }



  ///
  handleChange = (e) => {
    this.setState({
      city: e.target.value
    });
    
  }

}
