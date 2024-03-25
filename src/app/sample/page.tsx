// import { SampleForm } from "./form";
import { Form2 } from "./form2";

export default function TmntDataPage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Test</h2>
        {/* <SampleForm /> */}
        <Form2 />
      </div>
    </div>
  )
}