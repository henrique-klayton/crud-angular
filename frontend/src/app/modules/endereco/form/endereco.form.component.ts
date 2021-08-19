import {
	ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/service/alert.service';
import { FormValidationService } from 'src/app/shared/service/form.service';
import { STATES } from 'src/app/utils/constants';
import { isNullOrWhitespace } from 'src/app/utils/functions';
import { AddressService } from '../service/address.service';
import { AddressFormModel } from './model/address.form.model';

@Component({
	selector: 'app-endereco.form',
	templateUrl: './endereco.form.component.html',
	styleUrls: ['./endereco.form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnderecoFormComponent implements OnInit, OnDestroy {
	public form: FormGroup;
	public states = STATES;

	private _onDestroy = new Subject<void>();

	constructor(
		private _fb: FormBuilder,
		private _addressService: AddressService,
		public _alert: AlertService,
		public _formValidation: FormValidationService,
		public dialogRef: MatDialogRef<EnderecoFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data?: { id: string, table: AddressFormModel[] }
	) { }

	ngOnInit(): void {
		this.form = this._fb.group(new AddressFormModel());
		this.subscribeCep();
	}

	ngOnDestroy(): void {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	private subscribeCep(): void {
		this.cep.valueChanges
			.pipe(
				debounceTime(1000),
				takeUntil(this._onDestroy)
			).subscribe((v) => this.fetchCep(v));
	}

	public saveAddress(): void {
		const cep = this.cep.value;
		const address = this.data.table.find(a => a.cep === cep);
		if (address) {
			this._alert.baseAlert(`CEP ${cep} já cadastrado!`);
			return;
		}
		this._addressService.insertAddress(this.form.value)
			.then(() => this.dialogRef.close());
	}

	private fetchCep(cep: string) {
		if (!isNullOrWhitespace(cep) && cep.length === 8)
			this._addressService.fetchCep(cep).then((res) => this.form.patchValue(res));
	}

	get cep(): AbstractControl {
		return this.form.get('cep');
	}
}