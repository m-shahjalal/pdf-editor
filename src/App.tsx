import axios from "axios";
import Form from "./Components/Form";
import PDFList from "./Components/Show";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import EditModal from "./Components/EditModal";

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    background: '#00000080',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '80%'
  },
};

export default function App() {
  const [pdfs, setPDFs] = useState<string[]>([]);
  const [active, setActive] = useState('');
  const [isOpen, setIsOpen] = useState(false)

  const handleActive = (blob: any) => {
    setActive(blob)
    setIsOpen(true)
  }

  useEffect(() => {
    axios.get('http://localhost:8000/resource/')
      .then((response) => {
        const data = response.data.flatMap((pdf: string) => pdf);
        setPDFs(data)
      })
      .catch((error) => {
        console.error('Error fetching PDFs:', error);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-indigo-800 h-screen">
      <div className="bg-indigo-800 h-screen">
        <div className="container m-auto bg-indigo-800">
          <div className="flex justify-between gap-8 items-center h-screen">
            <div className="w-1/2">
              <h2 className="text-4xl tracking-tight font-extrabold text-gray-100 mb-4">
                <span className="block">Ready to dive in?</span>
                <span className="block">Start Editing your PDF.</span>
              </h2>
              <Form />
            </div>
            <div className="w-1/2">
              <img className="rounded-lg" src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="hero" />
            </div>
          </div>
          <div className="text-white text-3xl mb-8 border-b pb-2">PDF LIST</div>
          <div className="grid grid-cols-2 gap-3">
            {
              pdfs?.length && pdfs.map((pdf: string, inx: number) => {
                return <PDFList key={inx} data={pdf} handleActive={handleActive} />
              })
            }
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        <EditModal handleClose={() => setIsOpen(false)} data={active} />
      </Modal>
    </div>
  )
}