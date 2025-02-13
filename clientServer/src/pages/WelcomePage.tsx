import { useUser } from "@/store/UserStore";

const WelcomePage = () => {
    const {  setDialogOpen  } = useUser();
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="drop-shadow-xl text-4xl font-bold text-primary/80 p-3 bg-secondary rounded-lg text-center w-full max-w-3xl">
        Welcome to Planster <br /> Your Ultimate Project Command Center!
      </h1>

      <div
        className="drop-shadow-xl grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-7 mt-6 w-full max-w-screen-lg px-4"
      >
        <p className="drop-shadow-xl text-2xl font-medium text-secondary p-4 bg-primary rounded-lg shadow-md">
          You're just moments away from taking full control of your projects and
          teams. Planster is built for developers, project managers, and
          designers who demand efficiency, clarity, and seamless collaboration.
        </p>
        <p className="drop-shadow-2xl text-3xl font-medium  text-primary/80 p-3 bg-secondary rounded-lg shadow-md">
          🚀 Here’s what you can do right now: <br />
          ✔ Create a New Project – Define your vision with a name, description,
          and structured goals. <br />
          ✔ Add & Assign Tasks – Break down work, assign team members, and set
          clear responsibilities. <br />
          ✔ Prioritize & Set Deadlines – Keep everything on schedule with smart
          tracking. <br />✔ Collaborate in Real-Time – Comment, update, and
          monitor progress effortlessly.
        </p>
        <p className="drop-shadow-xl text-2xl font-medium text-secondary p-4 bg-primary rounded-lg shadow-md">
          No more scattered workflows—Planster keeps your team aligned,
          efficient, and focused. Start now and build something extraordinary.
          💡🔥
        </p>
      </div>

      <button
        className=" drop-shadow-xl mt-6 text-2xl font-bold text-primary bg-secondary p-3 rounded-lg hover:bg-primary hover:text-secondary transition-all shadow-md"
        onClick={() => {
            setDialogOpen(true);
          }}
      >
        🎯 Let's Do It!
      </button>
    </div>
  );
};

export default WelcomePage;
