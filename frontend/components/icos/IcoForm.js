import React from 'react';
import { connect } from 'react-redux';
import {
	Field,
	FieldArray,
	reduxForm,
	initialize,
	formValueSelector
} from 'redux-form';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';
import DropdownList from 'react-widgets/lib/DropdownList';

import 'react-widgets/dist/css/react-widgets.css';
import countries from './countries';

const renderDropdownList = ({ input, data, valueField, textField }) =>
	<DropdownList {...input}
		data={data}
		valueField={valueField}
		textField={textField}
		onChange={input.onChange} />

const renderMultiselect = ({ input, data, valueField, textField }) => {

	return (
		<Multiselect {...input}
			onBlur={() => input.onBlur()}
			value={input.value || []} // requires value to be an array
			data={data}
			valueField={valueField}
			textField={textField}
		/>
	)

}
const renderDateTimePicker = ({
	label,
	input: { onChange, value },
	showTime
}) => (
		<div className="form-group">
			<label className="col-sm-2 control-label">{label}</label>
			<div className="col-sm-10">
				<DateTimePicker
					onChange={onChange}
					format="DD MMM YYYY"
					time={showTime}
					value={!value ? null : new Date(value)}
				/>
			</div>
		</div>
	);

const renderField = ({ input, label, type, meta: { touched, error } }) => (
	<div className="form-group">
		<label className="col-sm-2 control-label">{label}</label>
		<div className="col-sm-10">
			<input {...input} type={type} placeholder={label} />
		</div>
	</div>
);

const renderRuleField = ({
	input,
	label,
	type,
	allowed,
	meta: { touched, error }
}) => (
		<div className="form-group">
			<label className="col-sm-2 control-label">{label}</label>
			<div className="col-sm-10">
				<input {...input} type={type} placeholder={label} readOnly={!allowed} />
			</div>
		</div>
	);
const renderPeriods = ({ fields, meta: { error, submitFailed } }) => (
	<ul className="render">
		<li>
			<button type="button" onClick={() => fields.push({})}>
				<Glyphicon glyph="plus" />Add Period
			</button>
		</li>
		{fields.map((period, index) => (
			<li key={index}>
				<button
					type="button"
					title="Remove Period"
					onClick={() => fields.remove(index)}
				>
					<Glyphicon glyph="trash" />
				</button>
				<h4>Period {index + 1}</h4>
				<Field
					name={`${period}.name`}
					type="text"
					component={renderField}
					label="Name"
				/>
				<Field
					name={`${period}.tokenPrice`}
					type="text"
					component={renderField}
					label="tokenPrice"
				/>
				<Field
					name={`${period}.tokensCap`}
					type="number"
					component={renderField}
					label="tokensCap"
				/>
				<Field
					name={`${period}.minTokens`}
					type="text"
					component={renderField}
					label="minTokens"
				/>
				<Field
					name={`${period}.dateStart`}
					type="text"
					showTime={false}
					component={renderDateTimePicker}
					label="dateStart"
				/>
				<Field
					name={`${period}.dateEnd`}
					type="text"
					showTime={false}
					component={renderDateTimePicker}
					label="dateEnd"
				/>
			</li>
		))}
	</ul>
);

const renderDocuments = ({ fields, meta: { error, submitFailed } }) => (
	<ul className="render">
		<li>
			<button type="button" onClick={() => fields.push({})}>
				<Glyphicon glyph="plus" />Add Document
			</button>
		</li>
		{fields.map((member, index) => (
			<li key={index}>
				<button
					type="button"
					title="Remove Document"
					onClick={() => fields.remove(index)}
				>
					<Glyphicon glyph="trash" />
				</button>
				<h4>Document {index + 1}</h4>
				<Field
					name={`${member}.name`}
					type="text"
					component={renderField}
					label="Name"
				/>
				<Field
					name={`${member}.url`}
					type="text"
					component={renderField}
					label="Url"
				/>
			</li>
		))}
	</ul>
);

let IcoForm = props => {
	const {
		handleSubmit,
		load,
		pristine,
		reset,
		submitting,
		btcRuleAllow,
		ethRuleAllow,
		usdRuleAllow,
		icoAdd
	} = props;
	Moment.locale('en');
	momentLocalizer();
	let country_list = countries();
	return (
		<form className="redux-form row ico-form" onSubmit={handleSubmit}>
			<div className="form-group">
				<label className="col-sm-2 control-label">Name</label>
				<div className="col-sm-10">
					<Field
						name="name"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">ncAccountName</label>
				<div className="col-sm-10">
					<Field
						name="ncAccountName"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Raised</label>
				<div className="col-sm-10">
					<Field
						name="raised"
						component="input"
						type="number"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Website</label>
				<div className="col-sm-10">
					<Field
						name="website"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Symbol</label>
				<div className="col-sm-10">
					<Field
						name="symbol"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Target</label>
				<div className="col-sm-10">
					<Field
						name="target"
						component="input"
						type="number"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Logo</label>
				<div className="col-sm-10">
					<Field
						name="logo"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Tokencurrency</label>
				<div className="col-sm-10">
					<Field
						name="tokencurrency"
						component="input"
						type="text"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Description</label>
				<div className="col-sm-10">
					<Field
						name="description"
						component="textarea"
						className="form-control"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">eth_cold_address</label>
				<div className="col-sm-10">
					<Field
						name="eth_cold_address"
						component="input"
						className="form-control"
						type="text"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">btc_cold_address</label>
				<div className="col-sm-10">
					<Field
						name="btc_cold_address"
						component="input"
						className="form-control"
						type="text"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">eth_hot_balance_min</label>
				<div className="col-sm-10">
					<Field
						name="eth_hot_balance_min"
						component="input"
						className="form-control"
						type="number"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">eth_hot_balance_max</label>
				<div className="col-sm-10">
					<Field
						name="eth_hot_balance_max"
						component="input"
						className="form-control"
						type="number"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">btc_hot_balance_min</label>
				<div className="col-sm-10">
					<Field
						name="btc_hot_balance_min"
						component="input"
						className="form-control"
						type="number"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">btc_hot_balance_max</label>
				<div className="col-sm-10">
					<Field
						name="btc_hot_balance_max"
						component="input"
						className="form-control"
						type="number"
						readOnly={!icoAdd}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">investmentsAllowed</label>
				<div className="col-sm-10">

					<Field
						name="investmentsAllowed"
						type="checkbox"
						component="input"
					/>

				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Visible</label>
				<div className="col-sm-10">

					<Field
						name="visible"
						type="checkbox"
						component="input"
					/>

				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">btcRule</label>
				<div className="col-sm-10">
					<ul className="render">
						<li>
							<Field
								name="btcRule.allowed"
								type="checkbox"
								component={renderField}
								label="allowed"
								id="btcRule"
							/>
							<Field
								name="btcRule.minPurchase"
								type="text"
								component={renderRuleField}
								label="minPurchase"
								allowed={btcRuleAllow}
							/>
						</li>
					</ul>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">ethRule</label>
				<div className="col-sm-10">
					<ul className="render">
						<li>
							<Field
								name="ethRule.allowed"
								type="checkbox"
								component={renderField}
								label="allowed"
								id="ethRule"
							/>
							<Field
								name="ethRule.minPurchase"
								type="text"
								component={renderRuleField}
								label="minPurchase"
								allowed={ethRuleAllow}
							/>
						</li>
					</ul>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">usdRule</label>
				<div className="col-sm-10">
					<ul className="render">
						<li>
							<Field
								name="usdRule.allowed"
								type="checkbox"
								component={renderField}
								label="allowed"
								id="usdRule"
							/>
							<Field
								name="usdRule.minPurchase"
								type="text"
								component={renderRuleField}
								label="minPurchase"
								allowed={usdRuleAllow}
							/>
						</li>
					</ul>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">investorRules</label>
				<div className="col-sm-10">
					<ul className="render">
						<li>
							<Field
								name="investorRules.accreditation"
								type="checkbox"
								component={renderField}
								label="accreditation"
							/>
							<Field
								name="investorRules.aml"
								type="checkbox"
								component={renderField}
								label="aml"
							/>
							<Field
								name="investorRules.kyc"
								type="checkbox"
								component={renderField}
								label="kyc"
							/>
						</li>
					</ul>
				</div>
			</div>

			<div className="form-group">
				<label className="col-sm-2 control-label">restrictedCountries</label>
				<div className="col-sm-10">
					<Field
						name="restrictedCountries"
						component={renderMultiselect}
						data={country_list}
						valueField="alpha2"
						textField="name"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Status</label>
				<div className="col-sm-10">
					<Field
						name="status"
						component={renderDropdownList}
						data={['active', 'pending', 'closed']}
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 control-label">Documents</label>
				<div className="col-sm-10">
					<FieldArray name="documents" component={renderDocuments} />
				</div>
			</div>

			<div className="form-group">
				<label className="col-sm-2 control-label">Periods</label>
				<div className="col-sm-10">
					<FieldArray name="periods" component={renderPeriods} />
				</div>
			</div>

			<div className="row center">
				{icoAdd ? (
					<button
						type="submit"
						className="btn btn-primary"
						disabled={pristine || submitting}
					>
						Create
					</button>
				) : (
						<button
							type="submit"
							className="btn btn-primary"
							disabled={pristine || submitting}
						>
							Update
					</button>
					)}
				<button
					type="button"
					className="btn btn-default"
					disabled={pristine || submitting}
					onClick={reset}
				>
					Undo Changes
				</button>
			</div>
		</form>
	);
};

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
IcoForm = reduxForm({
	form: 'initializeFromState'
})(IcoForm);

const selector = formValueSelector('initializeFromState');

IcoForm = connect((state, ownProps) => {
	const btcRuleAllow = selector(state, 'btcRule.allowed');
	const ethRuleAllow = selector(state, 'ethRule.allowed');
	const usdRuleAllow = selector(state, 'usdRule.allowed');

	return {
		btcRuleAllow,
		ethRuleAllow,
		usdRuleAllow
		// initialValues: ownProps.icoAdd ? '' : state.ico
	};
})(IcoForm);
export default IcoForm;
