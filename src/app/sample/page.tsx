import { TestForm } from "./form";

export default function TmntDataPage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Test</h2>
        <TestForm />
      </div>
    </div>
  )
}