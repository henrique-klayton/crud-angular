import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UserFormComponent } from './form/user.form.component';
import { UserModel } from './model/user.model';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    // "complement",
    'cep',
    // "birthday",
    'actions',
  ];
  public dataSource: MatTableDataSource<UserModel>;

  constructor(
    private _userService: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getData();
  }

  public openDialog(id?: string): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  public getData() {
    return this._userService
      .fetchData()
      .subscribe((res) => (this.dataSource.data = res));
  }

  public deleteUser(id: string) {
    this._userService
      .deleteUser(id)
      .then(() => this._snackBar.open('Usuário deletado com sucesso!', "Fechar"))
      .catch(() => this._snackBar.open('Erro ao deletar o usuário!', "Fechar"));
  }

  public applyFilter(event: Event) {
    console.log(event);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
