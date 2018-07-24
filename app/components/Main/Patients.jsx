import React, { Component } from "react";
import PatientProfile from "../Patient/PatientProfile";
import PatientsList from "../Patient/PatientsList";
import AddPatientPanel from "../Patient/AddPatientPanel";
import { connect } from "react-redux";

class PatientsContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searched_patients: [],
			no_match: false,
			show_add_patient_panel: false
		};
	}

	render() {
		let { searched_patients } = this.state,
			{
				selected_patient,
				patients,
				remove_selected_patient,
				add_appointment,
				add_patient,
				add_item,
				darken,
				diagnosis_list,
				add_dropdown_item
			} = this.props;

		return (
			<div className="route_section" id="patients_route">
				<button
					id="add_patient_btn"
					onClick={() => this.show_add_patient_panel()}
				>
					<i className="fa fa-user-plus" aria-hidden="true" />
				</button>

				{this.state.show_add_patient_panel ? (
					<AddPatientPanel
						add_patient={add_patient}
						close_patient_panel={() => this.close_patient_panel()}
					/>
				) : (
					""
				)}

				{this.render_view(this.props, this.state)}
			</div>
		);
	}

	render_view(props, state) {
		if (props.selected_patient) {
			return props.selected_patient.length > 0 ? (
				<PatientProfile
					lab_list={props.lab_list}
					stop_medicine={props.stop_medicine}
					medicine_dose_list={props.medicine_dose_list}
					add_dropdown_item={add_dropdown_item}
					diagnosis_list={diagnosis_list}
					medicine_list={props.medicine_list}
					patient={selected_patient}
					remove_selected_patient={remove_selected_patient}
					add_appointment={add_appointment}
					add_item={add_item}
					darken={darken}
				/>
			) : (
				<PatientsList
					patients={props.patients}
					searched_patients={state.searched_patients}
					render_patients={this.render_patients.bind(this)}
					search_patient={this.search_patient.bind(this)}
				/>
			);
		}
	}

	close_patient_panel() {
		this.setState({ show_add_patient_panel: false });
		this.props.darken();
	}

	show_add_patient_panel() {
		this.setState({ show_add_patient_panel: true });
		this.props.darken();
	}

	search_patient(e) {
		let value = e.target.value,
			searched_patients = [];

		if (value === "") {
			return this.setState({
				searched_patients: [],
				no_match: false
			});
		}

		if (value.length > 0) {
			for (let i = 0; i < this.props.patients.length; i++) {
				let patient = this.props.patients[i],
					patient_name = patient.name.toLowerCase();

				if (patient_name.startsWith(value)) {
					searched_patients.push(patient);
				}
			}

			if (searched_patients.length === 0) {
				return this.setState({ no_match: true });
			}
		}

		return this.setState({
			no_match: false,
			searched_patients: searched_patients
		});
	}

	render_patients(patients) {
		if (this.state.no_match === true) {
			return;
		}

		return (
			<div className="patients_list">
				{patients.map((patient, x) => (
					<div
						key={x}
						className="patient"
						onClick={() => this.props.show_patient_profile(patient)}
					>
						<span>{patient.name}</span>
						<span>{patient.birth}</span>
						<span>{patient.age}</span>
						<span>{patient.gender}</span>
						<span>{patient.address}</span>
						<span>{patient.phone}</span>
					</div>
				))}
			</div>
		);
	}
}

/* stop_medicine={this.stop_medicine.bind(this)}
show_patient_profile={this.show_patient_profile.bind(this)}
remove_selected_patient={this.remove_selected_patient.bind(
    this
)}            darken={this.darken}

add_dropdown_item={this.add_dropdown_item.bind(this)}
add_patient={this.add_patient.bind(this)}
add_appointment={this.add_appointment.bind(this)}
add_item={this.add_item.bind(this)} */

const mapStateToProps = state => {
	const {
		lab_list,
		diagnosis_list,
		medicine_list,
		medicine_dose_list,
		patients,
		selected_patient
	} = state.default;
	return {
		lab_list,
		diagnosis_list,
		medicine_list,
		medicine_dose_list,
		patients,
		selected_patient
	};
};

export default connect(mapStateToProps)(PatientsContainer);
