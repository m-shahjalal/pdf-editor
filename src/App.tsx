import Form from "./Components/Form";

export default function App() {
  return (
    <div>
      <div className="bg-indigo-800 h-screen">
        <div className="container m-auto">
          <div className="flex justify-betweena gap-8 items-center h-screen">
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
        </div>
      </div>
    </div>
  )
}