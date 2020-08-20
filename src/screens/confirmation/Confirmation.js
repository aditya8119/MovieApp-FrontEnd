import React, { Component } from 'react';
import Header from '../../common/header/Header';
import './Confirmation.css';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  success: {
    color: green[600],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
});


class Confirmation extends Component {
  constructor()
  {
    super();
    this.state = {
      open: false,
      bookingId: "",
      totalPrice: 0,
      coupon: ""
    }
  }

componentDidMount()
{
  this.setState({totalPrice: this.props.location.bookingSummary.unitPrice * this.props.location.bookingSummary.tickets.length})
}
  handleConfirmBooking = () =>
  {
    this.setState({ bookingId: "TYRE234WER", open: true });
    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": this.props.baseUrl + "bookings" ,
    //   "method": "POST",
    //   "headers": {
    //     "content-type": "application/json"
    //   },
    //   beforeSend: function (xhr) {
    //       xhr.setRequestHeader('Authorization', 'Bearer '+ sessionStorage.getItem('access-token'));
    //   },
    //   "data" : JSON.stringify({
    //     "customerUuid" : sessionStorage.getItem('uuid'),
    //     "bookingRequest" : {
    //         "show_id": this.props.location.bookingSummary.showId,
    //         "tickets": [
    //           this.props.location.bookingSummary.tickets
    //         ]
    //       }
    //   })
    // }
    // let that = this;

    // $.ajax(settings).done(function (response) {

    //   that.setState({ bookingId: response.reference_number, open: true });
    // })
  }

  handleClose = () =>
  {
    this.props.history.push("/");
  }

  couponApplyClickHandler = () => {
    let tp = this.state.totalPrice *.9;
    this.setState({totalPrice: tp})


  }
  couponChangeHandler = (e) =>{
this.setState({coupon:e.target.value})
  }


  render() {
    const { classes } = this.props;

    return(
      <div className="Details">
        <Header />
        <div className="summaryDiv marginTop16">
            <div>
              <Link to={"/bookshow/" +this.props.match.params.id}><Typography className="back" >
                  &#60; Back to Book Show
              </Typography></Link><br/>
              <Card className="cardStyle">
                <CardContent>
                  <Typography  variant="headline" component="h2">
                   SUMMARY
                  </Typography><br/>

                    <div className="coupon-container"><div className="summaryLeft"><Typography>Location:&nbsp; </Typography></div>
                    <div><Typography> {this.props.location.bookingSummary.location}</Typography></div></div>
                  <br/>

                    <div className="coupon-container"><div className="summaryLeft"><Typography>Language: &nbsp;</Typography></div>
                    <div><Typography> {this.props.location.bookingSummary.language}</Typography></div></div>
                  <br/>

                    <div className="coupon-container"><div className="summaryLeft"><Typography>Show Date: &nbsp;</Typography> </div>
                    <div><Typography> {this.props.location.bookingSummary.showDate}</Typography></div></div>
                  <br/>

                 
                    <div className="coupon-container"><div className="summaryLeft"><Typography>Tickets:&nbsp; </Typography> </div>
                    <div><Typography> {this.props.location.bookingSummary.tickets.toString()}</Typography></div></div>
                  <br/>

                    <div className="coupon-container"><div className="summaryLeft"><Typography>Unit Price:&nbsp;</Typography> </div>
                    <div><Typography> {this.props.location.bookingSummary.unitPrice}</Typography></div></div>
                  <br/>
                  <div className="coupon-container">
                    <div>
                     
                      <FormControl required className="formControl">
                                <InputLabel htmlFor="coupon"> Coupon Code: </InputLabel>
                                <Select
                                value={this.state.coupon}
                                    onChange={this.couponChangeHandler}>
                                       <MenuItem key="coupon1" value="OFFER10PC">
                                            OFFER10PC
                                        </MenuItem>
                                        <MenuItem key="coupon2" value="OFFER20PC">
                                            OFFER20PC
                                        </MenuItem>
                                        <MenuItem key="coupon3" value="OFFER30PC">
                                            OFFER25PC
                                        </MenuItem>
                                    
                                </Select>
                            </FormControl>
                            
                    </div>
                    <div className="marginApply">
                      <Button variant="contained" onClick={this.couponApplyClickHandler}  color="primary">
                        Apply
                      </Button>
                    </div>
                  </div>
                  <br/><br/>

                    <div className="coupon-container"><div className="summaryLeft"> <span className="bold">Total Price:&nbsp; </span></div>
                    <div>  {this.state.totalPrice}</div></div>
                   <br/>
                  <Button variant="contained" onClick={this.handleConfirmBooking}  color="primary">
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
        <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            className="snackbar"
            open={this.state.open}
            onClose={this.handleClose}
            message={
              <span id="client-snackbar" className={classes.success}>
                <div className="confirm"><div><CheckCircleIcon /></div><div className="msg"> Booking Confirmed! Your booking reference number is {this.state.bookingId}</div></div>
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
               <CloseIcon />
              </IconButton>,
            ]}
          />
      </div>

    )}
}

Confirmation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Confirmation);