import { useState } from "react";
import { toast } from "sonner";

export const Mailer = () => {
  const [mail, setMail] = useState({
    name: "",
    email: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setMail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/turn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mail.name,
          email: mail.email,
          date: new Date(mail.date).toISOString(),
        }),
      });
      const data = await response.json();
      if (data) {
        setMail({
          name: "",
          email: "",
          date: "",
        });
      }

      response.ok
        ? toast.success("Turn has been created")
        : toast.error("Turn has not been created");
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-max min-w-max w-60 md:w-96 p-5 mt-44 m-auto rounded-xl">
      <h1 className="text-gray-400 text-center pp font-medium text-2xl my-2">
        EmailSender
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between items-center"
      >
        <input
          type="text"
          placeholder="Name"
          className="my-2 p-2 py-3 rounded-xl w-full outline-none text-md font-medium pp"
          onChange={onInputChange}
          name="name"
          value={mail.name}
        />
        <input
          type="email"
          placeholder="youremail@gmail.com"
          className="my-5 p-2 py-3 rounded-xl w-full outline-none text-md font-medium pp"
          onChange={onInputChange}
          name="email"
          value={mail.email}
        />
        <input
          type="datetime-local"
          placeholder="Seleccione una fecha"
          className="my-2 p-2 py-3 rounded-xl w-full outline-none text-md font-medium pp"
          onChange={onInputChange}
          name="date"
          value={mail.date}
        />
        <button
          type="submit"
          className="bg-blue-400 my-5 px-12 py-2 rounded-lg text-lg w-full pp font-medium text-white font-medium hover:scale-95 transition-all hover:shadow-xl"
        >
          {loading ? "Cargando..." : "Send"}
        </button>
      </form>
    </div>
  );
};
