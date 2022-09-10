import Swal from 'sweetalert2'

export const Positive = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  customClass:{
    popup: "modal-positive"
  },
  timer: 3000,
  showClass: {
    popup: ''
  },
  hideClass: {
    popup: ''
  }
})
export const Negative = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  customClass:{
    popup: "modal-negative"
  },
  timer: 3000,
  showClass: {
    popup: ''
  },
  hideClass: {
    popup: ''
  }
})

export default Swal;
