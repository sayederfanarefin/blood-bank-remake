import React from "react";
import cx from "classnames";
import './index.scss';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";

import wizardStyle from "assets/jss/material-dashboard-pro-react/components/wizardStyle.jsx";
import ErrorCatcher from "components/ErrorCatcher";

type Props = {
  classes: Object,
  steps: Array<Object>,
  color: Array<string>,
  title: string,
  subtitle: string,
  previousButtonClasses: string,
  previousButtonText: string,
  nextButtonClasses: string,
  nextButtonText: string,
  finishButtonClasses: string,
  finishButtonText: string,
  finishButtonClick: Function,
  validate: boolean,
  footer: boolean,
  invalid?: boolean
}

type State = {
  currentStep: number,
  color: string,
  nextButton: boolean,
  previousButton: boolean,
  finishButton: boolean,
  width: string,
  movingTabStyle: Object,
  allStates: Object
}

@withStyles(wizardStyle)
export default class AddVehicle extends React.Component<Props, State> {
  static defaultProps = {
    color: "primary",
    title: "Here should go your title",
    previousButtonText: "Previous",
    previousButtonClasses: "",
    nextButtonClasses: "",
    nextButtonText: "Next",
    finishButtonClasses: "",
    finishButtonText: "Finish"
  }
  constructor(props) {
    super(props);
    var width;
    if (this.props.steps.length === 1) {
      width = "100%";
    } else {
      if (window.innerWidth < 600) {
        if (this.props.steps.length !== 3) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      } else {
        if (this.props.steps.length === 2) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      }
    }
    this.state = {
      currentStep: 0,
      color: this.props.color,
      nextButton: this.props.steps.length > 1 ? true : false,
      previousButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,
      width: width,
      movingTabStyle: {
        transition: "transform 0s"
      },
      allStates: {}
    };
    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
  }
  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }
  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }
  navigationStepChange(key) {
    if (this.props.steps) {
      var validationState = true;
      if (key > this.state.currentStep) {
        for (var i = this.state.currentStep; i < key; i++) {
          console.log('this.props.steps[i].stepId: ', this.props.steps[i].stepId)
          if (this[this.props.steps[i].stepId].sendState !== undefined) {
            this.setState({
              allStates: [
                ...this.state.allStates,
                {
                  [this.props.steps[i].stepId]: this[
                    this.props.steps[i].stepId
                  ].sendState()
                }
              ]
            });
          }
          if (
            this[this.props.steps[i].stepId].isValidated !== undefined &&
            this[this.props.steps[i].stepId].isValidated() === false
          ) {
            validationState = false;
            break;
          }
        }
      }
      if (validationState) {
        this.setState({
          currentStep: key,
          nextButton: this.props.steps.length > key + 1 ? true : false,
          previousButton: key > 0 ? true : false,
          finishButton: this.props.steps.length === key + 1 ? true : false
        });
        this.refreshAnimation(key);
      }
    }
  }
  nextButtonClick() {
    if (
      (this.props.validate &&
        ((this[this.props.steps[this.state.currentStep].stepId].isValidated !==
          undefined &&
          this[
            this.props.steps[this.state.currentStep].stepId
          ].isValidated()) ||
          this[this.props.steps[this.state.currentStep].stepId].isValidated ===
            undefined)) ||
      this.props.validate === undefined
    ) {
      if (
        this[this.props.steps[this.state.currentStep].stepId].sendState !==
        undefined
      ) {
        this.setState({
          allStates: [
            ...this.state.allStates,
            {
              [this.props.steps[this.state.currentStep].stepId]: this[
                this.props.steps[this.state.currentStep].stepId
              ].sendState()
            }
          ]
        });
      }
      var key = this.state.currentStep + 1;
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false
      });
      this.refreshAnimation(key);
    }
  }
  previousButtonClick() {
    if (
      this[this.props.steps[this.state.currentStep].stepId].sendState !==
      undefined
    ) {
      this.setState({
        allStates: [
          ...this.state.allStates,
          {
            [this.props.steps[this.state.currentStep].stepId]: this[
              this.props.steps[this.state.currentStep].stepId
            ].sendState()
          }
        ]
      });
    }
    var key = this.state.currentStep - 1;
    if (key >= 0) {
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false
      });
      this.refreshAnimation(key);
    }
  }
  finishButtonClick() {
    if (
      this.props.validate &&
      ((this[this.props.steps[this.state.currentStep].stepId].isValidated !==
        undefined &&
        this[this.props.steps[this.state.currentStep].stepId].isValidated()) ||
        this[this.props.steps[this.state.currentStep].stepId].isValidated ===
          undefined) &&
      this.props.finishButtonClick !== undefined
    ) {
      this.props.finishButtonClick();
    }
  }
  refreshAnimation(index) {
    var total = this.props.steps.length;
    var li_width = 100 / total;
    var total_steps = this.props.steps.length;
    var move_distance = this.refs.wizard.children[0].offsetWidth / total_steps;
    var index_temp = index;
    var vertical_level = 0;

    var mobile_device = window.innerWidth < 600 && total > 3;

    if (mobile_device) {
      move_distance = this.refs.wizard.children[0].offsetWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }

    this.setState({ width: li_width + "%" });

    var step_width = move_distance;
    move_distance = move_distance * index_temp;

    var current = index + 1;

    if (current === 1 || (mobile_device === true && index % 2 === 0)) {
      move_distance -= 8;
    } else if (
      current === total_steps ||
      (mobile_device === true && index % 2 === 1)
    ) {
      move_distance += 8;
    }

    if (mobile_device) {
      vertical_level = parseInt(index / 2, 10);
      vertical_level = vertical_level * 38;
    }
    var movingTabStyle = {
      width: step_width,
      transform:
        "translate3d(" + move_distance + "px, " + vertical_level + "px, 0)",
      transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)"
    };
    this.setState({ movingTabStyle: movingTabStyle });
  }
  render() {
    const { classes, subtitle, color, steps, invalid } = this.props;

    console.log('steps: ', steps)

    return (
      <ErrorCatcher>
        <div className={classes.wizardContainer} ref="wizard">
          <Card className={classes.card} style={{ marginTop: 0, boxShadow: invalid !== null ? "0 1px 4px 0 rgba(0, 0, 0, 0.14)" : "none" }}>
            {subtitle && <div className={classes.wizardHeader}>
              <h5 className={classes.subtitle}>{subtitle}</h5>
            </div>}
            <div className={classes.wizardNavigation}>
              <ul className={classes.nav}>
                {steps.map((prop, key) => {
                  return (
                    <li
                      className={classes.steps}
                      key={key}
                      style={{ width: this.state.width }}
                    >
                      <a
                        className={classes.stepsAnchor}
                        onClick={() => this.navigationStepChange(key)}
                      >
                        {prop.stepName}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div
                className={classes.movingTab + " active-tab-box " + (steps.length === 1 ? "centered " : "") + classes[color]}
                style={this.state.movingTabStyle}
              >
                {steps[this.state.currentStep].stepName}
              </div>
            </div>
            <div className={classes.content}>
              {steps.map((prop, key) => {
                const stepContentClasses = cx({
                  [classes.stepContentActive]: this.state.currentStep === key,
                  [classes.stepContent]: this.state.currentStep !== key
                });
                return (
                  <div className={stepContentClasses} key={key}>
                    <prop.stepComponent
                      innerRef={node => (this[prop.stepId] = node)}
                      allStates={this.state.allStates}
                      invalid={invalid}
                    />
                  </div>
                );
              })}
            </div>
            <div className={classes.footer}>
              <div className={classes.left}>
                {this.state.previousButton ? (
                  <Button
                    className={this.props.previousButtonClasses}
                    onClick={() => this.previousButtonClick()}
                  >
                    {this.props.previousButtonText}
                  </Button>
                ) : null}
              </div>
              <div className={classes.right}>
                {(this.props.footer && this.state.nextButton) ? (
                  <Button
                    color="primary"
                    className={this.props.nextButtonClasses}
                    onClick={() => this.nextButtonClick()}
                  >
                    {this.props.nextButtonText}
                  </Button>
                ) : null}
                {(this.props.footer && this.state.finishButton) ? (
                  <Button
                    color="primary"
                    className={this.finishButtonClasses}
                    onClick={() => this.finishButtonClick()}
                  >
                    {this.props.finishButtonText}
                  </Button>
                ) : null}
              </div>
              <div className={classes.clearfix} />
            </div>
          </Card>
        </div>
      </ErrorCatcher>
    );
  }
}
