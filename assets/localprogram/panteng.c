#include <wiringSerial.h>
#include <wiringPi.h>
#include <stdio.h>

void ReadSensorData(int fd, int *_HCHO, int *_PM);
{
    unsigned char str[22];
    int state = 0;
    int count = 0;
    int checksum = 143;
    serialFlush(fd);
    while (1)
    {
        unsigned char inByte = serialGetchar(fd);
        switch (state)
        {
        case 0:
            if (inByte == 0x42)
            {
                state = 1;
            }
            break;
        case 1:
            if (inByte == 0x4d)
            {
                state = 2;
                count = 0;
            }
            else
            {
                Hibernate(fd);
                return;
            }
            break;
        case 2:
            str[count] = inByte;
            count++;
            break;
        default:
            state = 0;
            break;
        }
        if (count > 21)
            break;
    }
    for (int i = 0; i < 20; i++)
    {
        checksum += (int)str[i];
    }
    if (checksum == ((int)str[20]) * 256 + str[21])
    {
        _PM = ((int)str[10]) * 256 + str[11];
        _HCHO = (((int)str[26]) * 256 + str[27]) * 10;
    }
}

int main(void)
{
    int fd;
    int hcho = -1, pm = -1;
    wiringPiSetup();
    if ((fd = serialOpen("/dev/ttyAMA0", 9600)) < 0)
    {
        printf("error\n");
        return -1;
    }
    ReadSensorData(fd, &hcho, &pm);
    printf("HCHO=%d,PM=%d", hcho, pm);
    serialClose(fd);
    return 0;
}
