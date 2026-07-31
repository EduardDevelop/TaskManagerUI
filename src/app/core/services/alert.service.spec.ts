import { TestBed } from '@angular/core/testing';
import Swal, { type SweetAlertResult } from 'sweetalert2';
import { AlertService } from './alert.service';

const result = (isConfirmed: boolean): SweetAlertResult<unknown> => ({
  isConfirmed,
  isDenied: false,
  isDismissed: !isConfirmed,
});

describe('AlertService', () => {
  let service: AlertService;
  let fireSpy: jasmine.Spy<typeof Swal.fire>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
    fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve(result(true)));
  });

  it('returns true when the user confirms', async () => {
    await expectAsync(service.confirm({ title: 'Confirmar' })).toBeResolvedTo(true);
    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Confirmar',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }));
  });

  it('returns false when the user cancels or dismisses', async () => {
    fireSpy.and.returnValue(Promise.resolve(result(false)));
    await expectAsync(service.confirm({ title: 'Cancelar' })).toBeResolvedTo(false);
  });

  it('shows success and error dialogs through the same facade', async () => {
    await service.success('Creada');
    await service.error('Falló', 'Intenta de nuevo');

    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', title: 'Creada' }));
    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'Falló', text: 'Intenta de nuevo' }));
  });
});
