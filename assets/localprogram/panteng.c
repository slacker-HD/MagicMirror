#include <wiringSerial.h>
#include <wiringPi.h>
#include <stdio.h>

int _HCHO = -1, _PM = -1;

void ReadSensorData(int fd)
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
        _PM = ((int)str[2]) * 256 + str[3];
        _HCHO = (((int)str[7]) * 256 + str[8]) * 10;
    }
}

int main(void)
{
    int fd;
    wiringPiSetup();
    if ((fd = serialOpen("/dev/ttyAMA0", 9600)) < 0)
    {
        printf("error\n");
        return -1;
    }
    ReadSensorData(fd);
    printf("HCHO=%d,PM=%d", _HCHO, _PM);
    serialClose(fd);
    return 0;
}
