import React, { Component } from 'react';
import Header from '../../common/header/Header'
import './BookShow.css';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';



class BookShow extends Component {

    constructor() {
        super();
        this.state = {
            location: "",
            theatre: "",
            language: "",
            showDate: "",
            showId: "",
            tickets: [],
            unitPrice: 0,
            availableTickets: 0,
            reqLocation: "dispNone",
            reqLanguage: "dispNone",
            reqShowDate: "dispNone",
            reqShowTime: "dispNone",
            reqTickets: "dispNone",
            reqTheatre: "dispNone",
            locations: [],
            languages: [],
            theatres: [],
            showDates: [],
            showTimes: [],
            originalShows: []
        }
    }

    componentWillMount() {

        let that = this;
        let dataFilter = null;
        let xhrFilter = new XMLHttpRequest();
        xhrFilter.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                that.setState({ originalShows: response.shows });
                let locations = [];

                for (let show of response.shows) {
                    locations.push({ id: show.theatre.city, location: show.theatre.city });
                }

                locations = locations.filter((loc, index, self) =>
                    index === self.findIndex((c) => (
                        c.id === loc.id
                    ))
                )


                that.setState({ locations: locations })
            }
        })

        xhrFilter.open("GET", this.props.baseUrl + "movies/" + this.props.match.params.id + "/shows");
        xhrFilter.setRequestHeader("Cache-Control", "no-cache");
        xhrFilter.send(dataFilter);



    }


    locationChangeHandler = event => {
        this.setState({ location: event.target.value });
        let theatres = [];

        for (let show of this.state.originalShows) {

            if (show.theatre.city === event.target.value) {
                theatres.push({ id: show.theatre.name, theatre: show.theatre.name });
            }
        }

        theatres = theatres.filter((theatre, index, self) =>
            index === self.findIndex((t) => (
                t.id === theatre.id
            ))
        )

        this.setState({ theatres: theatres })

    }

    theatreChangeHandler = event => {
        this.setState({ theatre: event.target.value });

        let languages = [];

        for (let show of this.state.originalShows) {
            if (show.theatre.city === this.state.location && show.theatre.name === event.target.value) {
                languages.push({ id: show.language, language: show.language });
            }
        }

        languages = languages.filter((lang, index, self) =>
            index === self.findIndex((l) => (
                l.id === lang.id
            ))
        )


        this.setState({ languages: languages })
    }
    languageChangeHandler = event => {
        this.setState({ language: event.target.value });

        let showDates = [];

        for (let show of this.state.originalShows) {
            if (show.theatre.city === this.state.location && show.theatre.name === this.state.theatre && show.language === event.target.value) {

                showDates.push({ id: show.show_timing, showDate: show.show_timing });

            }
        }

        showDates = showDates.filter((date, index, self) =>
            index === self.findIndex((d) => (
                d.id === date.id
            ))
        )


        this.setState({ showDates: showDates })
    }
    showDateChangeHandler = event => {
        this.setState({ showDate: event.target.value });

        let unitPrice = 0;
        let availableTickets = 0;

        for (let show of this.state.originalShows) {
            if (show.theatre.city === this.state.location && show.theatre.name === this.state.theatre && show.language === this.state.language && show.show_timing === event.target.value) {
                unitPrice = show.unit_price;
                availableTickets = show.available_seats;
                this.setState({ showId: show.id });

            }
        }

        this.setState({ unitPrice: unitPrice, availableTickets: availableTickets })
    }

    ticketsChangeHandler = event => {
        this.setState({ tickets: event.target.value.split(",") });
    }
    bookShowButtonHandler = () => {
        this.state.location === "" ? this.setState({ reqLocation: "dispBlock" }) : this.setState({ reqLocation: "dispNone" });
        this.state.language === "" ? this.setState({ reqLanguage: "dispBlock" }) : this.setState({ reqLanguage: "dispNone" });
        this.state.theatre === "" ? this.setState({ reqTheatre: "dispBlock" }) : this.setState({ reqTheatre: "dispNone" });
        this.state.showDate === "" ? this.setState({ reqShowDate: "dispBlock" }) : this.setState({ reqShowDate: "dispNone" });
        this.state.tickets.length === 0 ? this.setState({ reqTickets: "dispBlock" }) : this.setState({ reqTickets: "dispNone" });

        if ((this.state.location === "") || (this.state.language === "") || (this.state.showDate === "") || (this.state.tickets.length === 0)) { return; }

        this.props.history.push({
            pathname: '/confirm/' + this.props.match.params.id,
            bookingSummary: this.state
        })

    }

    render() {
        return (
            <div>
                <Header />
                <div className="bookShow">
                    <Typography className="back" >
                        <Link to={"/movie/" + this.props.match.params.id}>&#60; Back to Movie Details</Link>
                    </Typography>
                    <Card className="cardStyle">
                        <CardContent>
                            <Typography variant="headline" component="h2">
                                BOOK SHOW
                            </Typography><br />
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="location"> Choose Location: </InputLabel>
                                <Select
                                    value={this.state.location}
                                    onChange={this.locationChangeHandler}>
                                    {this.state.locations.map(loc => (
                                        <MenuItem key={"loc" + loc.id} value={loc.location}>
                                            {loc.location}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText className={this.state.reqLocation}><span className="red">Required</span></FormHelperText>
                            </FormControl>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="theatres"> Choose Theatre: </InputLabel>
                                <Select
                                    value={this.state.theatre}
                                    onChange={this.theatreChangeHandler}>
                                    {this.state.theatres.map(theatre => (
                                        <MenuItem key={"thea" + theatre.id} value={theatre.theatre}>
                                            {theatre.theatre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText className={this.state.reqTheatre}><span className="red">Required</span></FormHelperText>
                            </FormControl>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="language"> Choose Language: </InputLabel>
                                <Select
                                    value={this.state.language}
                                    onChange={this.languageChangeHandler}>
                                    {this.state.languages.map(lang => (
                                        <MenuItem key={"lang" + lang.id} value={lang.language}>
                                            {lang.language}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText className={this.state.reqLanguage}><span className="red">Required</span></FormHelperText>
                            </FormControl>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="showDate"> Choose Show Date & Time: </InputLabel>
                                <Select
                                    value={this.state.showDate}
                                    onChange={this.showDateChangeHandler}>
                                    {this.state.showDates.map(date => (
                                        <MenuItem key={"date" + date.id} value={date.showDate}>
                                            {date.showDate}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText className={this.state.reqShowDate}><span className="red">Required</span></FormHelperText>
                            </FormControl>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="tickets"> Seat Selection: ({this.state.availableTickets}  available) </InputLabel>
                                <Input id="tickets" value={this.state.tickets !== 0 ? this.state.tickets : ""} onChange={this.ticketsChangeHandler} />
                                <FormHelperText className={this.state.reqTickets}><span className="red">Required</span></FormHelperText>
                            </FormControl><br /><br />
                            <Typography>
                                Unit Price: Rs. {this.state.unitPrice}
                            </Typography><br />
                            <Typography>
                                Total Price: Rs. {this.state.unitPrice * this.state.tickets.length}
                            </Typography><br /><br />
                            <Button variant="contained" onClick={this.bookShowButtonHandler} color="primary">
                                BOOK SHOW
                            </Button>


                        </CardContent>
                    </Card>
                </div>


            </div>
        );
    }
}

export default BookShow;