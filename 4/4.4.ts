{
  type PlayerA = {
    firstName: string;
  };

  interface PlayerB {
    firstName: string;
  }

  class User implements PlayerB {
    constructor(public firstName: string) {}
  }
}
