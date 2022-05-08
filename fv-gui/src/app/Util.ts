export class Util{
    public static formatTime(time:Date): string{
        time = new Date(time)
        return time.toLocaleDateString() + " " + time.toLocaleTimeString('en-US')
    }
}